const mongoose = require('mongoose');
const { PARTICIPATION_STATUS } = require('../utils/constants');

const driveCollegeSchema = new mongoose.Schema({
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive',
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  participationStatus: {
    type: String,
    enum: Object.values(PARTICIPATION_STATUS),
    default: PARTICIPATION_STATUS.INVITED,
  },
  invitedAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

driveCollegeSchema.index({ driveId: 1, collegeId: 1 }, { unique: true });
driveCollegeSchema.index({ collegeId: 1 });

const DriveCollege = mongoose.model('DriveCollege', driveCollegeSchema);

module.exports = DriveCollege;

