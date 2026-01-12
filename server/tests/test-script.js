/**
 * Functional Test Script for HireFlow
 * Run with: node tests/test-script.js
 * 
 * Prerequisites:
 * - Server must be running on http://localhost:5000
 * - MongoDB must be running
 * - Test data should be set up (colleges, companies)
 * - Install axios: npm install axios (if not already installed)
 */

// Note: axios should be installed in server/node_modules
// If running from server directory, use: const axios = require('axios');
// If axios is not available, install it: npm install axios
let axios;
try {
  axios = require('axios');
} catch (error) {
  console.error('Error: axios is not installed. Please run: npm install axios');
  process.exit(1);
}

const API_BASE = 'http://localhost:5000/api';

// Test configuration
const config = {
  studentEmail: 'teststudent@example.com',
  studentPassword: 'password123',
  collegeEmail: 'testcollege@example.com',
  companyEmail: 'testcompany@example.com',
};

let tokens = {
  student: null,
  college: null,
  company: null,
};

let testData = {
  studentId: null,
  collegeId: null,
  companyId: null,
  driveId: null,
  applicationId: null,
};

// Helper functions
const api = {
  async login(email, password) {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return res.data.accessToken;
  },
  
  async get(url, token) {
    return axios.get(`${API_BASE}${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  async post(url, data, token) {
    return axios.post(`${API_BASE}${url}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  async put(url, data, token) {
    return axios.put(`${API_BASE}${url}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Test functions
async function testHealthCheck() {
  console.log('\n[1] Testing Health Check...');
  try {
    const res = await axios.get(`${API_BASE}/health`);
    console.log('✓ Health check passed:', res.data);
    return true;
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
    return false;
  }
}

async function testStudentLogin() {
  console.log('\n[2] Testing Student Login...');
  try {
    tokens.student = await api.login(config.studentEmail, config.studentPassword);
    console.log('✓ Student login successful');
    return true;
  } catch (error) {
    console.error('✗ Student login failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetEligibleDrives() {
  console.log('\n[3] Testing Get Eligible Drives...');
  try {
    const res = await api.get('/drives/eligible', tokens.student);
    console.log(`✓ Found ${res.data.data?.length || res.data.length} eligible drives`);
    return true;
  } catch (error) {
    console.error('✗ Get eligible drives failed:', error.response?.data || error.message);
    return false;
  }
}

async function testSubmitApplication() {
  console.log('\n[4] Testing Submit Application...');
  try {
    // First get eligible drives
    const drivesRes = await api.get('/drives/eligible', tokens.student);
    const drives = drivesRes.data.data || drivesRes.data;
    
    if (drives.length === 0) {
      console.log('⚠ No eligible drives found. Skipping application test.');
      return true;
    }
    
    const driveId = drives[0]._id;
    testData.driveId = driveId;
    
    const res = await api.post('/applications/submit', { driveId }, tokens.student);
    testData.applicationId = res.data.application._id;
    console.log('✓ Application submitted:', res.data.application._id);
    return true;
  } catch (error) {
    console.error('✗ Submit application failed:', error.response?.data || error.message);
    return false;
  }
}

async function testGetMyApplications() {
  console.log('\n[5] Testing Get My Applications...');
  try {
    const res = await api.get('/applications/my-applications', tokens.student);
    const apps = res.data.data || res.data;
    console.log(`✓ Found ${apps.length} applications`);
    return true;
  } catch (error) {
    console.error('✗ Get my applications failed:', error.response?.data || error.message);
    return false;
  }
}

async function testPagination() {
  console.log('\n[6] Testing Pagination...');
  try {
    const res = await api.get('/applications/my-applications?page=1&limit=5', tokens.student);
    const data = res.data;
    
    if (data.pagination) {
      console.log(`✓ Pagination working: Page ${data.pagination.currentPage} of ${data.pagination.totalPages}`);
      console.log(`  Total items: ${data.pagination.totalItems}, Items per page: ${data.pagination.itemsPerPage}`);
      return true;
    } else {
      console.log('⚠ Pagination not implemented for this endpoint');
      return true;
    }
  } catch (error) {
    console.error('✗ Pagination test failed:', error.response?.data || error.message);
    return false;
  }
}

async function testDataIntegrity() {
  console.log('\n[7] Testing Data Integrity...');
  try {
    // Test 1: Resume persistence
    const profileRes = await api.get('/students/profile', tokens.student);
    const resumeLink = profileRes.data.resumeLink;
    console.log(`✓ Resume link: ${resumeLink || 'Not uploaded'}`);
    
    // Test 2: Application persistence
    if (testData.applicationId) {
      const appRes = await api.get(`/applications/${testData.applicationId}`, tokens.student);
      console.log(`✓ Application persists: ${appRes.data.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('✗ Data integrity test failed:', error.response?.data || error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('='.repeat(50));
  console.log('HireFlow Functional Test Suite');
  console.log('='.repeat(50));
  
  const results = [];
  
  // Run tests
  results.push(await testHealthCheck());
  results.push(await testStudentLogin());
  results.push(await testGetEligibleDrives());
  results.push(await testSubmitApplication());
  results.push(await testGetMyApplications());
  results.push(await testPagination());
  results.push(await testDataIntegrity());
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('Test Summary');
  console.log('='.repeat(50));
  const passed = results.filter(r => r).length;
  const total = results.length;
  console.log(`Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('✓ All tests passed!');
    process.exit(0);
  } else {
    console.log('✗ Some tests failed');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

