const Drive = require('../models/Drive');
const DriveCollege = require('../models/DriveCollege');
const Application = require('../models/Application');
const Student = require('../models/Student');
const { APPLICATION_STATUS } = require('../utils/constants');

// Get eligible drives for a student
exports.getEligibleDrives = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const { parsePagination, createPaginatedResponse } = require('../utils/pagination');
    const { page, limit } = parsePagination(req);

    // Find drives where:
    // 1. Drive is active
    // 2. College has accepted participation
    // 3. Student meets eligibility criteria

    const driveColleges = await DriveCollege.find({
      collegeId: student.collegeId,
      participationStatus: 'Accepted',
    }).populate('driveId');

    const eligibleDrives = [];

    for (const dc of driveColleges) {
      const drive = await Drive.findById(dc.driveId).populate('companyId', 'name domain');
      
      if (!drive || drive.status !== 'active') continue;

      // Check eligibility
      const criteria = drive.eligibilityCriteria;
      if (criteria.minCGPA && student.cgpa < criteria.minCGPA) continue;
      if (criteria.allowedBranches && criteria.allowedBranches.length > 0) {
        if (!criteria.allowedBranches.includes(student.branch)) continue;
      }
      if (criteria.batch && criteria.batch !== student.batch) continue;

      // Check if already applied
      const existingApp = await Application.findOne({
        studentId: student._id,
        driveId: drive._id,
      });

      eligibleDrives.push({
        ...drive.toObject(),
        hasApplied: !!existingApp,
        applicationId: existingApp?._id,
      });
    }

    // Apply pagination
    const total = eligibleDrives.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDrives = eligibleDrives.slice(startIndex, endIndex);

    res.json(createPaginatedResponse(paginatedDrives, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// Get drive details
exports.getDriveDetails = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const student = await Student.findOne({ userId: req.user._id });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const drive = await Drive.findById(driveId)
      .populate('companyId', 'name domain recruiterContacts');

    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Check if student's college is participating
    const driveCollege = await DriveCollege.findOne({
      driveId: drive._id,
      collegeId: student.collegeId,
      participationStatus: 'Accepted',
    });

    if (!driveCollege) {
      return res.status(403).json({ message: 'This drive is not available for your college' });
    }

    // Check if already applied
    const application = await Application.findOne({
      studentId: student._id,
      driveId: drive._id,
    });

    res.json({
      ...drive.toObject(),
      hasApplied: !!application,
      application: application || null,
    });
  } catch (error) {
    next(error);
  }
};

