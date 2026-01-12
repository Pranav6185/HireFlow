const express = require('express');
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

// All routes require authentication and student role
router.use(authenticate);
router.use(rbac('student'));

router.post('/submit', applicationController.submitApplication);
router.get('/my-applications', applicationController.getMyApplications);
router.get('/:applicationId', applicationController.getApplicationStatus);

module.exports = router;

