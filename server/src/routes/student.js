const express = require('express');
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes require authentication and student role
router.use(authenticate);
router.use(rbac('student'));

// Validation rules
const updateProfileValidation = [
  body('name').optional().trim().notEmpty(),
  body('branch').optional().trim().notEmpty(),
  body('batch').optional().trim().notEmpty(),
  body('cgpa').optional().isFloat({ min: 0, max: 10 }),
];

// Routes
router.get('/profile', studentController.getProfile);
router.put('/profile', updateProfileValidation, studentController.updateProfile);
router.put('/resume', studentController.updateResume);
router.post('/resume/upload', upload.single('resume'), studentController.uploadResume);

module.exports = router;

