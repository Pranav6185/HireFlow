const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  departments: [{
    type: String,
    trim: true,
  }],
  tpoContacts: [{
    name: String,
    email: String,
    phone: String,
  }],
}, {
  timestamps: true,
});

const College = mongoose.model('College', collegeSchema);

module.exports = College;

