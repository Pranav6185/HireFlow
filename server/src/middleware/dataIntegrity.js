/**
 * Data Integrity Middleware
 * Ensures cross-college data isolation and validates operations
 */

const Application = require('../models/Application');
const Student = require('../models/Student');
const DriveCollege = require('../models/DriveCollege');

/**
 * Verify that a student belongs to the requesting college
 */
exports.verifyStudentBelongsToCollege = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const collegeId = req.user.collegeId;

    if (!collegeId) {
      return res.status(403).json({ message: 'College access required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (student.collegeId.toString() !== collegeId.toString()) {
      return res.status(403).json({ message: 'Student does not belong to your college' });
    }

    req.student = student;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify that an application belongs to the requesting student's college
 */
exports.verifyApplicationCollege = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify application belongs to student's college
    if (application.collegeId.toString() !== student.collegeId.toString()) {
      return res.status(403).json({ message: 'Application does not belong to your college' });
    }

    // If student is accessing, verify it's their application
    if (req.user.role === 'student' && application.studentId.toString() !== student._id.toString()) {
      return res.status(403).json({ message: 'Application does not belong to you' });
    }

    req.application = application;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify that a drive is accessible to the requesting college
 */
exports.verifyDriveCollegeAccess = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const collegeId = req.user.collegeId;

    if (!collegeId) {
      return res.status(403).json({ message: 'College access required' });
    }

    const driveCollege = await DriveCollege.findOne({
      driveId,
      collegeId,
      participationStatus: 'Accepted',
    });

    if (!driveCollege) {
      return res.status(403).json({ message: 'Drive is not available for your college' });
    }

    req.driveCollege = driveCollege;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Ensure atomic operations for bulk updates
 */
exports.ensureAtomicBulkUpdate = async (req, res, next) => {
  // This middleware ensures that bulk operations use transactions
  // For MongoDB, we'll use sessions for transactions
  req.useTransaction = true;
  next();
};

