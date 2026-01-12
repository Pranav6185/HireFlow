# HireFlow - Running and Testing Guide

This guide will help you set up, run, and test the HireFlow platform.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**
- **Git** (for cloning the repository)

---

## 🚀 Initial Setup

### Step 1: Install Dependencies

```bash
# Install root dependencies (if any)
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Set Up Environment Variables

#### Server Environment (`server/.env`)

Create a `.env` file in the `server/` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hireflow
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hireflow

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Server Port
PORT=5000

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (SMTP - Optional for testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@hireflow.com
```

#### Client Environment (`client/.env`)

Create a `.env` file in the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

**MongoDB Atlas:**
- No local setup needed, just use your connection string in `MONGODB_URI`

---

## 🏃 Running the Application

### Option 1: Run Both Server and Client (Recommended)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### Option 2: Production Build

**Build the frontend:**
```bash
cd client
npm run build
```

**Start the server:**
```bash
cd server
npm start
```

---

## 👥 Creating Users: Company and College Signup

Currently, the system only has student signup in the UI. Companies and colleges need to be created manually. Here are two methods:

### Method 1: Using MongoDB Shell (Recommended for Testing)

#### Create a College

1. Open MongoDB shell or MongoDB Compass
2. Connect to your database
3. Run the following commands:

```javascript
// Switch to your database
use hireflow

// Create a College
db.colleges.insertOne({
  name: "ABC Engineering College",
  location: "Mumbai, Maharashtra",
  departments: ["CSE", "IT", "ECE", "ME"],
  tpoContacts: [{
    name: "Dr. John Doe",
    email: "tpo@abccollege.edu",
    phone: "+91-1234567890"
  }]
})

// Note the _id returned (e.g., ObjectId("..."))
// Let's say it's: ObjectId("507f1f77bcf86cd799439011")
```

4. Create a User for the College:

```javascript
// Create User with collegeId
db.users.insertOne({
  email: "tpo@abccollege.edu",
  password: "$2a$10$...", // You need to hash the password
  role: "college",
  collegeId: ObjectId("507f1f77bcf86cd799439011") // Use the college _id from above
})
```

**Note:** To hash the password, you can use Node.js:

```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('your-password', 10);
console.log(hashedPassword);
```

#### Create a Company

```javascript
// Create a Company
db.companies.insertOne({
  name: "TechCorp Solutions",
  domain: "techcorp.com",
  recruiterContacts: [{
    name: "Jane Smith",
    email: "recruiter@techcorp.com",
    phone: "+91-9876543210"
  }]
})

// Note the _id returned
// Let's say it's: ObjectId("507f1f77bcf86cd799439012")
```

4. Create a User for the Company:

```javascript
// Create User with companyId
db.users.insertOne({
  email: "recruiter@techcorp.com",
  password: "$2a$10$...", // Hashed password
  role: "company",
  companyId: ObjectId("507f1f77bcf86cd799439012") // Use the company _id from above
})
```

### Method 2: Using Setup Script (Easiest - Recommended)

Run the automated setup script:

```bash
cd server
node scripts/setup-test-data.js
```

This will create:
- A test college with user account
- A test company with user account
- Print login credentials

### Method 3: Using API Endpoints (Alternative)

You can also use the API endpoints to signup:

#### Signup as Company

```bash
curl -X POST http://localhost:5000/api/auth/signup/company \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@techcorp.com",
    "password": "password123",
    "name": "TechCorp Solutions",
    "domain": "techcorp.com",
    "recruiterContacts": [{
      "name": "Jane Smith",
      "email": "recruiter@techcorp.com",
      "phone": "+91-9876543210"
    }]
  }'
```

#### Signup as College

```bash
curl -X POST http://localhost:5000/api/auth/signup/college \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tpo@abccollege.edu",
    "password": "password123",
    "name": "ABC Engineering College",
    "location": "Mumbai, Maharashtra",
    "departments": ["CSE", "IT", "ECE", "ME"],
    "tpoContacts": [{
      "name": "Dr. John Doe",
      "email": "tpo@abccollege.edu",
      "phone": "+91-1234567890"
    }]
  }'
```

---

## 🧪 Testing the Application

### 1. Health Check

Test if the server is running:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "HireFlow API is running"
}
```

### 2. Functional Test Script

Run the automated test script:

```bash
cd server
node tests/test-script.js
```

**Note:** Before running tests, ensure:
- Server is running
- Test users exist (see setup script below)
- MongoDB is connected

### 3. Manual Testing Workflow

#### Test Student Flow

1. **Signup as Student:**
   - Go to http://localhost:3000/signup
   - Fill in student details
   - Use a valid `collegeId` (from the college you created)
   - Sign up

2. **Login:**
   - Go to http://localhost:3000/login
   - Login with student credentials

3. **Upload Resume:**
   - Go to Profile page
   - Upload a PDF resume

4. **Browse Drives:**
   - Go to Browse Drives
   - View eligible drives

5. **Apply to Drive:**
   - Click on a drive
   - Click "Apply"

6. **View Applications:**
   - Go to My Applications
   - View application status

#### Test College Flow

1. **Login as College:**
   - Use the college credentials you created
   - Go to http://localhost:3000/login
   - Login (should redirect to `/college/dashboard`)

2. **Manage Students:**
   - View student list
   - Verify students
   - Edit student information

3. **Manage Drive Participation:**
   - View invited drives
   - Accept/reject drive invitations
   - Push eligible applicants

#### Test Company Flow

1. **Login as Company:**
   - Use the company credentials you created
   - Go to http://localhost:3000/login
   - Login (should redirect to `/company/dashboard`)

2. **Create Drive:**
   - Go to Create Drive
   - Fill in drive details
   - Select colleges to invite
   - Create drive

3. **Manage Applicants:**
   - View applicants for a drive
   - Shortlist candidates
   - Advance to rounds
   - Issue offers

### 4. End-to-End Test Scenario

Follow this complete workflow:

1. **Company creates a drive:**
   - Login as company
   - Create a drive with eligibility criteria
   - Invite a college

2. **College accepts invitation:**
   - Login as college
   - Accept the drive invitation
   - Push eligible students

3. **Student applies:**
   - Login as student
   - Browse drives
   - Apply to the drive

4. **Company shortlists:**
   - Login as company
   - View applicants
   - Shortlist candidates

5. **Company issues offers:**
   - Advance candidates through rounds
   - Issue offers

6. **Student accepts offer:**
   - Login as student
   - View offer
   - Accept offer

---

## 🛠️ Setup Script for Test Data

Create a file `server/scripts/setup-test-data.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/User');
const College = require('../src/models/College');
const Company = require('../src/models/Company');

async function setupTestData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create College
    const college = new College({
      name: 'ABC Engineering College',
      location: 'Mumbai, Maharashtra',
      departments: ['CSE', 'IT', 'ECE', 'ME'],
      tpoContacts: [{
        name: 'Dr. John Doe',
        email: 'tpo@abccollege.edu',
        phone: '+91-1234567890',
      }],
    });
    await college.save();
    console.log('✓ College created:', college._id);

    // Create Company
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

    // Hash password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create College User
    const collegeUser = new User({
      email: 'tpo@abccollege.edu',
      password: hashedPassword,
      role: 'college',
      collegeId: college._id,
    });
    await collegeUser.save();
    console.log('✓ College user created:', collegeUser.email, '| Password:', password);

    // Create Company User
    const companyUser = new User({
      email: 'recruiter@techcorp.com',
      password: hashedPassword,
      role: 'company',
      companyId: company._id,
    });
    await companyUser.save();
    console.log('✓ Company user created:', companyUser.email, '| Password:', password);

    console.log('\n✅ Test data setup complete!');
    console.log('\nLogin Credentials:');
    console.log('College: tpo@abccollege.edu / password123');
    console.log('Company: recruiter@techcorp.com / password123');
    console.log('\nCollege ID for student signup:', college._id);

    process.exit(0);
  } catch (error) {
    console.error('Error setting up test data:', error);
    process.exit(1);
  }
}

setupTestData();
```

**Run the script:**
```bash
cd server
node scripts/setup-test-data.js
```

---

## 📊 Testing Checklist

### Functional Testing

- [ ] Student can signup
- [ ] Student can login
- [ ] Student can upload resume
- [ ] Student can view eligible drives
- [ ] Student can apply to drives
- [ ] Student can view application status
- [ ] College can login
- [ ] College can view students
- [ ] College can verify students
- [ ] College can accept drive invitations
- [ ] College can push eligible applicants
- [ ] Company can login
- [ ] Company can create drives
- [ ] Company can invite colleges
- [ ] Company can view applicants
- [ ] Company can shortlist candidates
- [ ] Company can issue offers
- [ ] Student can accept offers

### Data Integrity Testing

- [ ] Resume persists after reload
- [ ] Offers are downloadable
- [ ] No cross-college data leakage
- [ ] Round transitions are atomic
- [ ] Bulk operations work correctly

### Performance Testing

- [ ] Pagination works on large datasets
- [ ] Bulk shortlist completes < 1s
- [ ] No API degradation with 500+ applications

### UX Testing

- [ ] Loading indicators show during async operations
- [ ] Error messages are user-friendly
- [ ] Empty states display correctly
- [ ] Form validation works
- [ ] Pagination navigation works

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error:** `MongooseError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB port (default: 27017)

### JWT Token Issues

**Error:** `JsonWebTokenError: invalid token`

**Solution:**
- Clear browser localStorage
- Check `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env`
- Ensure secrets are consistent

### CORS Issues

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
- Ensure server is running
- Check `REACT_APP_API_URL` in client `.env`
- Verify CORS is enabled in server

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill the process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

---

## 📝 API Testing with Postman

### Import Collection

1. Create a Postman collection
2. Set environment variables:
   - `base_url`: `http://localhost:5000/api`
   - `accessToken`: (will be set after login)

### Test Endpoints

**Login:**
```
POST {{base_url}}/auth/login
Body: {
  "email": "student@example.com",
  "password": "password123"
}
```

**Get Profile:**
```
GET {{base_url}}/students/profile
Headers: {
  "Authorization": "Bearer {{accessToken}}"
}
```

---

## 🎯 Next Steps

1. **Create Test Data:** Run the setup script
2. **Test Each Role:** Follow the manual testing workflow
3. **Run Automated Tests:** Execute the test script
4. **Check Performance:** Test with large datasets
5. **Review Logs:** Check server console for errors

---

## 📚 Additional Resources

- **MongoDB Documentation:** https://docs.mongodb.com/
- **Express.js Guide:** https://expressjs.com/
- **React Documentation:** https://react.dev/
- **JWT Guide:** https://jwt.io/

---

**Happy Testing! 🚀**

