const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  index: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Test', 'Interview', 'Technical', 'HR', 'Custom'],
    required: true,
  },
  schedulingInfo: {
    venue: String,
    link: String,
    date: Date,
    mode: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
    },
  },
}, { _id: false });

const driveSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  ctc: {
    type: Number,
  },
  stipend: {
    type: Number,
  },
  mode: {
    type: String,
    enum: ['on-campus', 'virtual', 'pooled'],
    default: 'on-campus',
  },
  roundStructure: [roundSchema],
  eligibilityCriteria: {
    minCGPA: {
      type: Number,
      default: 0,
    },
    allowedBranches: [{
      type: String,
    }],
    batch: {
      type: String,
    },
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed'],
    default: 'draft',
  },
}, {
  timestamps: true,
});

driveSchema.index({ companyId: 1 });
driveSchema.index({ status: 1 });

const Drive = mongoose.model('Drive', driveSchema);

module.exports = Drive;

