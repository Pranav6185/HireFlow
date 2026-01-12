const express = require('express');
const { body } = require('express-validator');
const placementController = require('../controllers/placementController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

// All routes require authenticated college user
router.use(authenticate);
router.use(rbac('college'));

router.post(
  '/confirm',
  [
    body('applicationId').notEmpty().withMessage('applicationId is required'),
    body('joiningStatus')
      .isIn(['Pending', 'Joined', 'Not Joined'])
      .withMessage('Invalid joining status'),
  ],
  placementController.confirmPlacement
);

router.get('/', placementController.getPlacementRecords);
router.get('/export', placementController.exportPlacementCsv);

module.exports = router;


