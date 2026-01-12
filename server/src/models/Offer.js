const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    unique: true,
  },
  offerLetterLink: {
    type: String,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  acknowledgedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['issued', 'acknowledged', 'rejected'],
    default: 'issued',
  },
}, {
  timestamps: true,
});

offerSchema.index({ applicationId: 1 });

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;

