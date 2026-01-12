const express = require('express');
const { body } = require('express-validator');
const companyController = require('../controllers/companyController');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { uploadDocument } = require('../middleware/upload');

const router = express.Router();

// All routes require authentication and company role
router.use(authenticate);
router.use(rbac('company'));

// Dashboard
router.get('/dashboard', companyController.getDashboard);

// Colleges (for inviting)
router.get('/colleges', companyController.getColleges);

// Drives
router.get('/drives', companyController.getDrives);
router.post('/drives', [
  body('role').trim().notEmpty(),
  body('ctc').optional().isNumeric(),
  body('stipend').optional().isNumeric(),
], companyController.createDrive);
router.get('/drives/:driveId', companyController.getDriveDetails);
router.put('/drives/:driveId', companyController.updateDrive);
router.post('/drives/:driveId/invite-colleges', [
  body('collegeIds').isArray().notEmpty(),
], companyController.inviteColleges);

// Upload brochure
router.post('/drives/:driveId/brochure', uploadDocument.single('brochure'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const Drive = require('../models/Drive');
    const Company = require('../models/Company');
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drive = await Drive.findById(req.params.driveId);

    if (!drive || drive.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    drive.brochureLink = req.file.path;
    await drive.save();

    res.json({
      message: 'Brochure uploaded successfully',
      brochureLink: drive.brochureLink,
    });
  } catch (error) {
    next(error);
  }
});

// Applicants
router.get('/drives/:driveId/applicants', companyController.getApplicants);
router.post('/drives/:driveId/shortlist', [
  body('applicationIds').isArray().notEmpty(),
], companyController.shortlistApplicants);
router.post('/drives/:driveId/advance-round', [
  body('applicationIds').isArray().notEmpty(),
  body('roundIndex').isInt({ min: 0 }),
], companyController.advanceRound);

// Offers
router.post('/drives/:driveId/offers', [
  body('applicationIds').isArray().notEmpty(),
  body('offerLetterLinks').notEmpty(),
], companyController.issueOffers);
router.get('/drives/:driveId/offers', companyController.getOffers);
router.get('/drives/:driveId/export', companyController.exportSelected);

module.exports = router;

