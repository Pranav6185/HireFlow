# Setup Summary - Company & College Signup

## ✅ What's Been Added

### 1. API Endpoints for Company & College Signup

**Company Signup:**
```
POST /api/auth/signup/company
```

**College Signup:**
```
POST /api/auth/signup/college
```

### 2. Automated Setup Script

**File:** `server/scripts/setup-test-data.js`

This script automatically creates:
- A test college with user account
- A test company with user account
- Prints all credentials

**Run it:**
```bash
cd server
node scripts/setup-test-data.js
```

### 3. Comprehensive Guides

- **QUICK_START.md** - Get running in 5 minutes
- **RUNNING_AND_TESTING_GUIDE.md** - Complete testing guide

---

## 🚀 Quick Start (3 Steps)

### Step 1: Setup Environment

Create `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/hireflow
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=5000
```

Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 2: Create Test Data

```bash
cd server
node scripts/setup-test-data.js
```

**Output:**
```
✓ College created: 507f1f77bcf86cd799439011
✓ Company created: 507f1f77bcf86cd799439012
✓ College user created: tpo@abccollege.edu / password123
✓ Company user created: recruiter@techcorp.com / password123

College ID for student signup: 507f1f77bcf86cd799439011
```

### Step 3: Start Application

**Terminal 1:**
```bash
cd server
npm run dev
```

**Terminal 2:**
```bash
cd client
npm start
```

---

## 👥 User Creation Methods

### Method 1: Setup Script (Easiest) ⭐

```bash
cd server
node scripts/setup-test-data.js
```

### Method 2: API Endpoints

**Company:**
```bash
curl -X POST http://localhost:5000/api/auth/signup/company \
  -H "Content-Type: application/json" \
  -d '{
    "email": "recruiter@company.com",
    "password": "password123",
    "name": "My Company",
    "domain": "company.com"
  }'
```

**College:**
```bash
curl -X POST http://localhost:5000/api/auth/signup/college \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tpo@college.edu",
    "password": "password123",
    "name": "My College",
    "location": "City, State"
  }'
```

### Method 3: MongoDB Shell

See `RUNNING_AND_TESTING_GUIDE.md` for detailed MongoDB commands.

---

## 📋 Test Credentials (After Setup Script)

| Role | Email | Password | Notes |
|------|-------|----------|-------|
| **College** | `tpo@abccollege.edu` | `password123` | TPO account |
| **Company** | `recruiter@techcorp.com` | `password123` | Recruiter account |
| **Student** | (Your email) | (Your password) | Signup via UI |

**College ID for Student Signup:** (Printed by setup script)

---

## 🧪 Testing Workflow

### 1. Create Test Data
```bash
cd server
node scripts/setup-test-data.js
```

### 2. Start Application
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm start
```

### 3. Test Each Role

**Student:**
1. Go to http://localhost:3000/signup
2. Use College ID from setup script
3. Signup and login

**Company:**
1. Go to http://localhost:3000/login
2. Login: `recruiter@techcorp.com` / `password123`
3. Create a drive
4. Invite college

**College:**
1. Go to http://localhost:3000/login
2. Login: `tpo@abccollege.edu` / `password123`
3. Accept drive invitation
4. Manage students

### 4. Complete End-to-End Flow

1. Company creates drive → Invites college
2. College accepts → Pushes eligible students
3. Student applies → Company shortlists
4. Company issues offer → Student accepts

---

## 📚 Documentation Files

- **QUICK_START.md** - Fast setup guide
- **RUNNING_AND_TESTING_GUIDE.md** - Complete testing documentation
- **PHASE6_COMPLETION.md** - Phase 6 features
- **SETUP_SUMMARY.md** - This file

---

## 🎯 Next Steps

1. ✅ Run setup script to create test data
2. ✅ Start server and client
3. ✅ Test each user role
4. ✅ Follow end-to-end workflow
5. ✅ Run automated tests: `node tests/test-script.js`

---

**Everything is ready! Start with `QUICK_START.md` for the fastest setup.** 🚀

