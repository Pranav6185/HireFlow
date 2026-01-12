const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  branch: {
    type: String,
    required: true,
    trim: true,
  },
  batch: {
    type: String,
    required: true,
    trim: true, // Year of Passing (YOP)
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  resumeLink: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
studentSchema.index({ collegeId: 1 });
studentSchema.index({ userId: 1 });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;

