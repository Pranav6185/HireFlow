const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('collegeId').notEmpty(),
  body('branch').trim().notEmpty(),
  body('batch').trim().notEmpty(),
  body('cgpa').isFloat({ min: 0, max: 10 }),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

const companySignupValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
];

const collegeSignupValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
  body('location').trim().notEmpty(),
];

// Routes
router.post('/signup', signupValidation, authController.signup); // Student signup
router.post('/signup/company', companySignupValidation, authController.signupCompany);
router.post('/signup/college', collegeSignupValidation, authController.signupCollege);
router.post('/login', loginValidation, authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

module.exports = router;

