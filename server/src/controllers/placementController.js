const PlacementRecord = require('../models/PlacementRecord');
const Application = require('../models/Application');
const Student = require('../models/Student');

// Confirm a final join and create/update placement record
exports.confirmPlacement = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;
    const { applicationId, joiningStatus } = req.body;

    if (!['Pending', 'Joined', 'Not Joined'].includes(joiningStatus)) {
      return res.status(400).json({ message: 'Invalid joining status' });
    }

    const application = await Application.findById(applicationId)
      .populate('studentId')
      .populate('driveId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.collegeId.toString() !== collegeId.toString()) {
      return res
        .status(403)
        .json({ message: 'Application does not belong to this college' });
    }

    let record = await PlacementRecord.findOne({
      studentId: application.studentId._id,
      driveId: application.driveId._id,
      collegeId,
    });

    if (!record) {
      record = new PlacementRecord({
        studentId: application.studentId._id,
        driveId: application.driveId._id,
        collegeId,
        offerAccepted: joiningStatus === 'Joined',
        joiningStatus,
      });
    } else {
      record.offerAccepted = joiningStatus === 'Joined';
      record.joiningStatus = joiningStatus;
    }

    await record.save();

    res.json({ message: 'Placement record updated', record });
  } catch (error) {
    next(error);
  }
};

// List placement records for this college
exports.getPlacementRecords = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;

    const records = await PlacementRecord.find({ collegeId })
      .populate('studentId', 'name branch batch cgpa')
      .populate({
        path: 'driveId',
        select: 'role companyId',
        populate: { path: 'companyId', select: 'name domain' },
      })
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    next(error);
  }
};

// Export placement stats as CSV
exports.exportPlacementCsv = async (req, res, next) => {
  try {
    const collegeId = req.user.collegeId;

    const records = await PlacementRecord.find({ collegeId })
      .populate('studentId', 'name branch batch cgpa')
      .populate({
        path: 'driveId',
        select: 'role companyId',
        populate: { path: 'companyId', select: 'name domain' },
      })
      .lean();

    const header = [
      'StudentName',
      'Branch',
      'Batch',
      'CGPA',
      'Company',
      'Role',
      'OfferAccepted',
      'JoiningStatus',
    ];

    const rows = [
      header.join(','),
      ...records.map((r) =>
        [
          `"${r.studentId?.name || ''}"`,
          `"${r.studentId?.branch || ''}"`,
          `"${r.studentId?.batch || ''}"`,
          r.studentId?.cgpa ?? '',
          `"${r.driveId?.companyId?.name || ''}"`,
          `"${r.driveId?.role || ''}"`,
          r.offerAccepted ? 'Yes' : 'No',
          r.joiningStatus,
        ].join(',')
      ),
    ];

    const csv = rows.join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('placements.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};


