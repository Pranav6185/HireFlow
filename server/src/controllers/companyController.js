const { validationResult } = require('express-validator');
const Company = require('../models/Company');
const Drive = require('../models/Drive');
const DriveCollege = require('../models/DriveCollege');
const Application = require('../models/Application');
const Student = require('../models/Student');
const Offer = require('../models/Offer');
const College = require('../models/College');
const { APPLICATION_STATUS, PARTICIPATION_STATUS } = require('../utils/constants');

// Get company dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Get drive statistics
    const totalDrives = await Drive.countDocuments({ companyId: company._id });
    const activeDrives = await Drive.countDocuments({ 
      companyId: company._id, 
      status: 'active' 
    });
    
    // Get application statistics
    const drives = await Drive.find({ companyId: company._id }).select('_id');
    const driveIds = drives.map(d => d._id);
    const totalApplications = await Application.countDocuments({ driveId: { $in: driveIds } });
    const offeredCount = await Offer.countDocuments();

    res.json({
      company,
      stats: {
        totalDrives,
        activeDrives,
        totalApplications,
        offeredCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create drive
exports.createDrive = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const {
      role,
      ctc,
      stipend,
      mode,
      roundStructure,
      eligibilityCriteria,
      collegeIds,
      brochureLink,
    } = req.body;

    // Create drive
    const drive = new Drive({
      companyId: company._id,
      role,
      ctc,
      stipend,
      mode: mode || 'on-campus',
      roundStructure: roundStructure || [],
      eligibilityCriteria: eligibilityCriteria || {},
      status: 'draft',
    });

    if (brochureLink) {
      drive.brochureLink = brochureLink;
    }

    await drive.save();

    // Invite colleges if provided
    if (collegeIds && Array.isArray(collegeIds) && collegeIds.length > 0) {
      const driveColleges = collegeIds.map(collegeId => ({
        driveId: drive._id,
        collegeId,
        participationStatus: PARTICIPATION_STATUS.INVITED,
      }));

      await DriveCollege.insertMany(driveColleges);
    }

    res.status(201).json({
      message: 'Drive created successfully',
      drive,
    });
  } catch (error) {
    next(error);
  }
};

// Get all drives for company
exports.getDrives = async (req, res, next) => {
  try {
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drives = await Drive.find({ companyId: company._id })
      .populate('companyId', 'name domain')
      .sort({ createdAt: -1 });

    res.json(drives);
  } catch (error) {
    next(error);
  }
};

// Get drive details
exports.getDriveDetails = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drive = await Drive.findById(driveId)
      .populate('companyId', 'name domain');

    if (!drive || drive.companyId._id.toString() !== company._id.toString()) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Get invited colleges
    const driveColleges = await DriveCollege.find({ driveId: drive._id })
      .populate('collegeId', 'name location');

    res.json({
      ...drive.toObject(),
      invitedColleges: driveColleges,
    });
  } catch (error) {
    next(error);
  }
};

// Update drive
exports.updateDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drive = await Drive.findById(driveId);

    if (!drive || drive.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    const {
      role,
      ctc,
      stipend,
      mode,
      roundStructure,
      eligibilityCriteria,
      status,
      brochureLink,
    } = req.body;

    if (role) drive.role = role;
    if (ctc !== undefined) drive.ctc = ctc;
    if (stipend !== undefined) drive.stipend = stipend;
    if (mode) drive.mode = mode;
    if (roundStructure) drive.roundStructure = roundStructure;
    if (eligibilityCriteria) drive.eligibilityCriteria = eligibilityCriteria;
    if (status) drive.status = status;
    if (brochureLink !== undefined) drive.brochureLink = brochureLink;

    await drive.save();

    res.json({
      message: 'Drive updated successfully',
      drive,
    });
  } catch (error) {
    next(error);
  }
};

// Invite colleges to drive
exports.inviteColleges = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const { collegeIds } = req.body;
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drive = await Drive.findById(driveId);

    if (!drive || drive.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    if (!Array.isArray(collegeIds) || collegeIds.length === 0) {
      return res.status(400).json({ message: 'collegeIds must be a non-empty array' });
    }

    // Check existing invitations
    const existing = await DriveCollege.find({
      driveId: drive._id,
      collegeId: { $in: collegeIds },
    });

    const existingCollegeIds = existing.map(dc => dc.collegeId.toString());
    const newCollegeIds = collegeIds.filter(
      id => !existingCollegeIds.includes(id.toString())
    );

    if (newCollegeIds.length === 0) {
      return res.status(400).json({ message: 'All colleges are already invited' });
    }

    // Create new invitations
    const driveColleges = newCollegeIds.map(collegeId => ({
      driveId: drive._id,
      collegeId,
      participationStatus: PARTICIPATION_STATUS.INVITED,
    }));

    await DriveCollege.insertMany(driveColleges);

    res.json({
      message: 'Colleges invited successfully',
      invitedCount: newCollegeIds.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get applicants for a drive
exports.getApplicants = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const { collegeId, status } = req.query;
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drive = await Drive.findById(driveId);

    if (!drive || drive.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Build query
    const query = { driveId: drive._id };
    if (collegeId) {
      query.collegeId = collegeId;
    }
    if (status) {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate('studentId', 'name branch batch cgpa resumeLink')
      .populate('collegeId', 'name location')
      .sort({ submittedAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// Shortlist applicants
exports.shortlistApplicants = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const { applicationIds, status } = req.body;
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drive = await Drive.findById(driveId);

    if (!drive || drive.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ message: 'applicationIds must be a non-empty array' });
    }

    const targetStatus = status || APPLICATION_STATUS.SHORTLISTED;

    // Update applications
    const result = await Application.updateMany(
      {
        _id: { $in: applicationIds },
        driveId: drive._id,
      },
      {
        $set: { status: targetStatus },
        $push: {
          timeline: {
            status: targetStatus,
            updatedBy: 'company',
            updatedAt: new Date(),
          },
        },
      }
    );

    res.json({
      message: `${result.modifiedCount} applicants updated`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

// Advance applicants to next round
exports.advanceRound = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const { applicationIds, roundIndex } = req.body;
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drive = await Drive.findById(driveId);

    if (!drive || drive.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ message: 'applicationIds must be a non-empty array' });
    }

    // Determine next status based on round index
    const roundStatusMap = {
      0: APPLICATION_STATUS.ROUND_1,
      1: APPLICATION_STATUS.ROUND_2,
      2: APPLICATION_STATUS.FINAL,
    };

    const nextStatus = roundStatusMap[roundIndex] || APPLICATION_STATUS.FINAL;

    // Update applications
    const result = await Application.updateMany(
      {
        _id: { $in: applicationIds },
        driveId: drive._id,
      },
      {
        $set: { status: nextStatus },
        $push: {
          timeline: {
            status: nextStatus,
            updatedBy: 'company',
            updatedAt: new Date(),
          },
        },
      }
    );

    res.json({
      message: `${result.modifiedCount} applicants advanced to next round`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

// Issue offers
exports.issueOffers = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const { applicationIds, offerLetterLinks } = req.body;
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drive = await Drive.findById(driveId);

    if (!drive || drive.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ message: 'applicationIds must be a non-empty array' });
    }

    // Validate applications belong to this drive
    const applications = await Application.find({
      _id: { $in: applicationIds },
      driveId: drive._id,
    });

    if (applications.length !== applicationIds.length) {
      return res.status(400).json({ message: 'Some applications not found' });
    }

    // Create offers
    const offers = [];
    for (let i = 0; i < applications.length; i++) {
      const applicationId = applications[i]._id;
      const offerLetterLink = Array.isArray(offerLetterLinks) 
        ? offerLetterLinks[i] 
        : offerLetterLinks;

      // Check if offer already exists
      let offer = await Offer.findOne({ applicationId });
      
      if (offer) {
        // Update existing offer
        offer.offerLetterLink = offerLetterLink;
        offer.issuedAt = new Date();
        offer.status = 'issued';
        await offer.save();
      } else {
        // Create new offer
        offer = new Offer({
          applicationId,
          offerLetterLink,
        });
        await offer.save();
      }

      // Update application status
      await Application.findByIdAndUpdate(applicationId, {
        $set: { status: APPLICATION_STATUS.OFFERED },
        $push: {
          timeline: {
            status: APPLICATION_STATUS.OFFERED,
            updatedBy: 'company',
            updatedAt: new Date(),
          },
        },
      });

      offers.push(offer);
    }

    res.json({
      message: `${offers.length} offers issued successfully`,
      offers,
    });
  } catch (error) {
    next(error);
  }
};

// Get offers for a drive
exports.getOffers = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drive = await Drive.findById(driveId);

    if (!drive || drive.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Get all applications for this drive
    const applications = await Application.find({ driveId: drive._id }).select('_id');
    const applicationIds = applications.map(a => a._id);

    // Get offers
    const offers = await Offer.find({ applicationId: { $in: applicationIds } })
      .populate({
        path: 'applicationId',
        populate: [
          { path: 'studentId', select: 'name branch batch cgpa' },
          { path: 'collegeId', select: 'name' },
        ],
      })
      .sort({ issuedAt: -1 });

    res.json(offers);
  } catch (error) {
    next(error);
  }
};

// Export selected candidates
exports.exportSelected = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const user = req.user;
    const company = await Company.findById(user.companyId);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const drive = await Drive.findById(driveId);

    if (!drive || drive.companyId.toString() !== company._id.toString()) {
      return res.status(404).json({ message: 'Drive not found' });
    }

    // Get all applications with offers
    const applications = await Application.find({ 
      driveId: drive._id,
      status: APPLICATION_STATUS.OFFERED,
    }).populate('studentId', 'name email branch batch cgpa')
      .populate('collegeId', 'name');

    const offers = await Offer.find({
      applicationId: { $in: applications.map(a => a._id) },
    });

    // Create CSV
    const csvRows = [
      ['Name', 'Email', 'Branch', 'Batch', 'CGPA', 'College', 'Offer Status', 'Acknowledged'].join(','),
    ];

    for (const app of applications) {
      const offer = offers.find(o => o.applicationId.toString() === app._id.toString());
      const row = [
        app.studentId.name,
        app.studentId.email || '',
        app.studentId.branch,
        app.studentId.batch,
        app.studentId.cgpa,
        app.collegeId.name,
        offer ? offer.status : 'N/A',
        offer && offer.acknowledgedAt ? 'Yes' : 'No',
      ];
      csvRows.push(row.join(','));
    }

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=selected-candidates-${driveId}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

// Get all colleges (for inviting)
exports.getColleges = async (req, res, next) => {
  try {
    const colleges = await College.find().select('name location').sort({ name: 1 });
    res.json(colleges);
  } catch (error) {
    next(error);
  }
};

