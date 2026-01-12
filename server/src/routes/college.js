const express = require('express');
const { body } = require('express-validator');
const collegeController = require('../controllers/collegeController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

// All routes require authenticated college user
router.use(authenticate);
router.use(rbac('college'));

// Dashboard summary
router.get('/dashboard', collegeController.getDashboardSummary);

// Student management
router.get('/students', collegeController.getStudents);
router.put(
  '/students/:studentId/verify',
  collegeController.verifyStudent
);
router.put(
  '/students/:studentId',
  [
    body('name').optional().trim().notEmpty(),
    body('branch').optional().trim().notEmpty(),
    body('batch').optional().trim().notEmpty(),
    body('cgpa').optional().isFloat({ min: 0, max: 10 }),
  ],
  collegeController.updateStudent
);
router.get('/students/export', collegeController.exportStudentsCsv);

// Drive participation
router.get('/drives', collegeController.getInvitedDrives);
router.post(
  '/drives/:driveCollegeId/respond',
  [
    body('action')
      .isIn(['accept', 'reject'])
      .withMessage('action must be accept or reject'),
  ],
  collegeController.respondToDriveInvite
);
router.post(
  '/drives/:driveId/push-eligible',
  collegeController.pushEligibleApplicants
);

module.exports = router;


