const { validationResult } = require('express-validator');
const Student = require('../models/Student');
const User = require('../models/User');

// Get student profile
exports.getProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('collegeId', 'name location');

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
};

// Update student profile
exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, branch, batch, cgpa } = req.body;
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Update fields
    if (name) student.name = name;
    if (branch) student.branch = branch;
    if (batch) student.batch = batch;
    if (cgpa !== undefined) student.cgpa = cgpa;

    await student.save();

    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    next(error);
  }
};

// Update resume link
exports.updateResume = async (req, res, next) => {
  try {
    const { resumeLink } = req.body;

    if (!resumeLink) {
      return res.status(400).json({ message: 'Resume link is required' });
    }

    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    student.resumeLink = resumeLink;
    await student.save();

    res.json({ message: 'Resume updated successfully', student });
  } catch (error) {
    next(error);
  }
};

// Upload resume file
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Get secure URL from Cloudinary
    const resumeLink = req.file.path;

    student.resumeLink = resumeLink;
    await student.save();

    res.json({
      message: 'Resume uploaded successfully',
      resumeLink: student.resumeLink,
    });
  } catch (error) {
    next(error);
  }
};

