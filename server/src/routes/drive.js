const express = require('express');
const driveController = require('../controllers/driveController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

// Student routes
router.get('/eligible', authenticate, rbac('student'), driveController.getEligibleDrives);
router.get('/:driveId', authenticate, rbac('student'), driveController.getDriveDetails);

module.exports = router;

