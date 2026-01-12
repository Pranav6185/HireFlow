/**
 * Setup Test Data Script
 * 
 * This script creates test data for companies and colleges
 * Run with: node scripts/setup-test-data.js
 * 
 * Prerequisites:
 * - MongoDB must be running
 * - .env file must be configured
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');
const College = require('../src/models/College');
const Company = require('../src/models/Company');

async function setupTestData() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Check if data already exists
    const existingCollege = await College.findOne({ name: 'ABC Engineering College' });
    const existingCompany = await Company.findOne({ name: 'TechCorp Solutions' });

    if (existingCollege || existingCompany) {
      console.log('⚠ Test data already exists!');
      console.log('College ID:', existingCollege?._id);
      console.log('Company ID:', existingCompany?._id);
      console.log('\nTo recreate, delete existing data first.');
      process.exit(0);
    }

    // Create College
    console.log('Creating test college...');
    const college = new College({
      name: 'ABC Engineering College',
      location: 'Mumbai, Maharashtra',
      departments: ['CSE', 'IT', 'ECE', 'ME', 'CE'],
      tpoContacts: [{
        name: 'Dr. John Doe',
        email: 'tpo@abccollege.edu',
        phone: '+91-1234567890',
      }],
    });
    await college.save();
    console.log('✓ College created:', college._id);
    console.log('  Name:', college.name);
    console.log('  Location:', college.location);

    // Create Company
    console.log('\nCreating test company...');
    const company = new Company({
      name: 'TechCorp Solutions',
      domain: 'techcorp.com',
      recruiterContacts: [{
        name: 'Jane Smith',
        email: 'recruiter@techcorp.com',
        phone: '+91-9876543210',
      }],
    });
    await company.save();
    console.log('✓ Company created:', company._id);
    console.log('  Name:', company.name);
    console.log('  Domain:', company.domain);

    // Hash password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create College User
    console.log('\nCreating college user...');
    const collegeUser = new User({
      email: 'tpo@abccollege.edu',
      password: hashedPassword,
      role: 'college',
      collegeId: college._id,
    });
    await collegeUser.save();
    console.log('✓ College user created');
    console.log('  Email:', collegeUser.email);
    console.log('  Password:', password);

    // Create Company User
    console.log('\nCreating company user...');
    const companyUser = new User({
      email: 'recruiter@techcorp.com',
      password: hashedPassword,
      role: 'company',
      companyId: company._id,
    });
    await companyUser.save();
    console.log('✓ Company user created');
    console.log('  Email:', companyUser.email);
    console.log('  Password:', password);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Test data setup complete!');
    console.log('='.repeat(50));
    console.log('\n📋 Login Credentials:');
    console.log('─'.repeat(50));
    console.log('College:');
    console.log('  Email: tpo@abccollege.edu');
    console.log('  Password: password123');
    console.log('\nCompany:');
    console.log('  Email: recruiter@techcorp.com');
    console.log('  Password: password123');
    console.log('\n📝 For Student Signup:');
    console.log('  College ID:', college._id);
    console.log('─'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error setting up test data:', error.message);
    if (error.code === 11000) {
      console.error('⚠ Duplicate entry detected. Some data may already exist.');
    }
    process.exit(1);
  }
}

// Run the script
setupTestData();

