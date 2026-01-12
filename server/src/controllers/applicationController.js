const Application = require('../models/Application');
const Drive = require('../models/Drive');
const Student = require('../models/Student');
const DriveCollege = require('../models/DriveCollege');
const { APPLICATION_STATUS } = require('../utils/constants');

// Submit application
exports.submitApplication = async (req, res, next) => {
  try {
    const { driveId } = req.body;
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Check if resume is uploaded
    if (!student.resumeLink) {
      return res.status(400).json({ message: 'Please upload your resume before applying' });
    }

    // Check if drive exists and is active
    const drive = await Drive.findById(driveId);
    if (!drive || drive.status !== 'active') {
      return res.status(400).json({ message: 'Drive not available for applications' });
    }

    // Check if college is participating
    const driveCollege = await DriveCollege.findOne({
      driveId: drive._id,
      collegeId: student.collegeId,
      participationStatus: 'Accepted',
    });

    if (!driveCollege) {
      return res.status(403).json({ message: 'This drive is not available for your college' });
    }

    // Check eligibility
    const criteria = drive.eligibilityCriteria;
    if (criteria.minCGPA && student.cgpa < criteria.minCGPA) {
      return res.status(400).json({ message: 'You do not meet the minimum CGPA requirement' });
    }
    if (criteria.allowedBranches && criteria.allowedBranches.length > 0) {
      if (!criteria.allowedBranches.includes(student.branch)) {
        return res.status(400).json({ message: 'Your branch is not eligible for this drive' });
      }
    }
    if (criteria.batch && criteria.batch !== student.batch) {
      return res.status(400).json({ message: 'Your batch is not eligible for this drive' });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      studentId: student._id,
      driveId: drive._id,
    });

    if (existingApp) {
      return res.status(400).json({ message: 'You have already applied to this drive' });
    }

    // Create application
    const application = new Application({
      studentId: student._id,
      driveId: drive._id,
      collegeId: student.collegeId,
      status: APPLICATION_STATUS.APPLIED,
      timeline: [{
        status: APPLICATION_STATUS.APPLIED,
        updatedBy: 'student',
      }],
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// Get student's applications
exports.getMyApplications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const { parsePagination, createPaginatedResponse, applyPagination } = require('../utils/pagination');
    const { page, limit, skip } = parsePagination(req);

    const query = Application.find({ studentId: student._id })
      .populate('driveId', 'role ctc stipend roundStructure')
      .populate({
        path: 'driveId',
        populate: {
          path: 'companyId',
          select: 'name domain',
        },
      })
      .sort({ submittedAt: -1 });

    const total = await Application.countDocuments({ studentId: student._id });
    const applications = await query.skip(skip).limit(limit);

    res.json(createPaginatedResponse(applications, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// Get application status
exports.getApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const application = await Application.findById(applicationId)
      .populate('driveId', 'role ctc stipend roundStructure')
      .populate({
        path: 'driveId',
        populate: {
          path: 'companyId',
          select: 'name domain',
        },
      });

    if (!application || application.studentId.toString() !== student._id.toString()) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};

