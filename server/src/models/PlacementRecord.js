const mongoose = require('mongoose');

const placementRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
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
    offerAccepted: {
      type: Boolean,
      default: false,
    },
    joiningStatus: {
      type: String,
      enum: ['Pending', 'Joined', 'Not Joined'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

placementRecordSchema.index({ collegeId: 1 });
placementRecordSchema.index({ studentId: 1 });
placementRecordSchema.index({ driveId: 1 });

const PlacementRecord = mongoose.model('PlacementRecord', placementRecordSchema);

module.exports = PlacementRecord;


