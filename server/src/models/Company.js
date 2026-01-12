const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  domain: {
    type: String,
    trim: true,
  },
  recruiterContacts: [{
    name: String,
    email: String,
    phone: String,
  }],
}, {
  timestamps: true,
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

