const Student = require('../models/Student');
const College = require('../models/College');
const DriveCollege = require('../models/DriveCollege');
const Application = require('../models/Application');
const PlacementRecord = require('../models/PlacementRecord');

// Get current college profile + basic stats
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    const [studentCount, verifiedStudentCount, invitedDrivesCount, placementCount] =
      await Promise.all([
        Student.countDocuments({ collegeId }),
        Student.countDocuments({ collegeId, isVerified: true }),
        DriveCollege.countDocuments({ collegeId }),
        PlacementRecord.countDocuments({ collegeId }),
      ]);

    res.json({
      college,
      stats: {
        students: studentCount,
        verifiedStudents: verifiedStudentCount,
        invitedDrives: invitedDrivesCount,
        placements: placementCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// List students for this college
exports.getStudents = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;
    const { verified, search } = req.query;

    const query = { collegeId };
    if (verified === 'true') query.isVerified = true;
    if (verified === 'false') query.isVerified = false;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { branch: new RegExp(search, 'i') },
        { batch: new RegExp(search, 'i') },
      ];
    }

    const students = await Student.find(query).sort({ name: 1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
};

// Verify a student profile
exports.verifyStudent = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;
    const { studentId } = req.params;

    const student = await Student.findOne({ _id: studentId, collegeId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found for this college' });
    }

    student.isVerified = true;
    await student.save();

    res.json({ message: 'Student verified successfully', student });
  } catch (error) {
    next(error);
  }
};

// Update student basic fields (for corrections)
exports.updateStudent = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;
    const { studentId } = req.params;
    const { name, branch, batch, cgpa } = req.body;

    const student = await Student.findOne({ _id: studentId, collegeId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found for this college' });
    }

    if (name) student.name = name;
    if (branch) student.branch = branch;
    if (batch) student.batch = batch;
    if (cgpa !== undefined) student.cgpa = cgpa;

    await student.save();

    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    next(error);
  }
};

// Export students as CSV (basic export for TPO)
exports.exportStudentsCsv = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;
    const students = await Student.find({ collegeId }).lean();

    const header = [
      'Name',
      'Email',
      'Branch',
      'Batch',
      'CGPA',
      'Verified',
      'ResumeLink',
    ];

    const rows = [
      header.join(','),
      ...students.map((s) =>
        [
          `"${s.name}"`,
          '', // email is on User, omitted for now
          `"${s.branch}"`,
          `"${s.batch}"`,
          s.cgpa,
          s.isVerified ? 'Yes' : 'No',
          s.resumeLink || '',
        ].join(',')
      ),
    ];

    const csv = rows.join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('students.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

// List invited drives for this college
exports.getInvitedDrives = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;

    const invites = await DriveCollege.find({ collegeId })
      .populate({
        path: 'driveId',
        populate: { path: 'companyId', select: 'name domain' },
      })
      .sort({ createdAt: -1 });

    res.json(invites);
  } catch (error) {
    next(error);
  }
};

// Accept / Reject drive participation
exports.respondToDriveInvite = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;
    const { driveCollegeId } = req.params;
    const { action } = req.body; // 'accept' or 'reject'

    const invite = await DriveCollege.findOne({
      _id: driveCollegeId,
      collegeId,
    });

    if (!invite) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    invite.participationStatus = action === 'accept' ? 'Accepted' : 'Rejected';
    invite.respondedAt = new Date();
    await invite.save();

    res.json({ message: 'Response saved successfully', invite });
  } catch (error) {
    next(error);
  }
};

// Push eligible applicants for a drive (marks them as ELIGIBLE / creates applications)
exports.pushEligibleApplicants = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;
    const { driveId } = req.params;

    const invite = await DriveCollege.findOne({
      driveId,
      collegeId,
      participationStatus: 'Accepted',
    }).populate('driveId');

    if (!invite) {
      return res
        .status(403)
        .json({ message: 'College is not participating in this drive' });
    }

    const drive = invite.driveId;
    const criteria = drive.eligibilityCriteria || {};

    const query = {
      collegeId,
      isVerified: true,
    };

    if (criteria.minCGPA) {
      query.cgpa = { $gte: criteria.minCGPA };
    }
    if (criteria.allowedBranches && criteria.allowedBranches.length > 0) {
      query.branch = { $in: criteria.allowedBranches };
    }
    if (criteria.batch) {
      query.batch = criteria.batch;
    }

    const students = await Student.find(query);

    let createdOrUpdatedCount = 0;

    for (const student of students) {
      let application = await Application.findOne({
        studentId: student._id,
        driveId: drive._id,
      });

      if (!application) {
        application = new Application({
          studentId: student._id,
          driveId: drive._id,
          collegeId,
          status: 'ELIGIBLE',
          timeline: [
            {
              status: 'ELIGIBLE',
              updatedBy: 'college',
            },
          ],
        });
      } else {
        application.status = 'ELIGIBLE';
        application.timeline.push({
          status: 'ELIGIBLE',
          updatedBy: 'college',
        });
      }

      await application.save();
      createdOrUpdatedCount += 1;
    }

    res.json({
      message: 'Eligible applicants pushed successfully',
      count: createdOrUpdatedCount,
    });
  } catch (error) {
    next(error);
  }
};


