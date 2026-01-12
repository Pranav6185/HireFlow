# HireFlow - Quick Start Guide

Get up and running in 5 minutes! 🚀

---

## ⚡ Quick Setup

### 1. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Configure Environment

**Create `server/.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/hireflow
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
PORT=5000
```

**Create `client/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 4. Create Test Data

```bash
cd server
node scripts/setup-test-data.js
```

This creates:
- ✅ College: `tpo@abccollege.edu` / `password123`
- ✅ Company: `recruiter@techcorp.com` / `password123`
- ✅ Prints College ID for student signup

### 5. Start the Application

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

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## 🎯 Quick Test Workflow

### Step 1: Signup as Student

1. Go to http://localhost:3000/signup
2. Use the **College ID** from the setup script output
3. Fill in student details
4. Sign up

### Step 2: Login as Company

1. Go to http://localhost:3000/login
2. Login: `recruiter@techcorp.com` / `password123`
3. Create a drive
4. Invite the college

### Step 3: Login as College

1. Go to http://localhost:3000/login
2. Login: `tpo@abccollege.edu` / `password123`
3. Accept the drive invitation
4. Push eligible students

### Step 4: Complete the Flow

1. Login as student
2. Browse drives
3. Apply to drive
4. Company shortlists
5. Company issues offer
6. Student accepts offer

---

## 📝 Test Credentials

After running `setup-test-data.js`:

| Role | Email | Password |
|------|-------|----------|
| College | `tpo@abccollege.edu` | `password123` |
| Company | `recruiter@techcorp.com` | `password123` |
| Student | (Signup via UI) | (Your choice) |

---

## 🐛 Common Issues

### MongoDB Not Running
```bash
# Check if MongoDB is running
# Windows: Check Services
# macOS/Linux: sudo systemctl status mongod
```

### Port Already in Use
```bash
# Kill process on port 5000
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -ti:5000 | xargs kill -9
```

### Module Not Found
```bash
# Reinstall dependencies
cd server && npm install
cd ../client && npm install
```

---

## 📚 Next Steps

- Read [RUNNING_AND_TESTING_GUIDE.md](./RUNNING_AND_TESTING_GUIDE.md) for detailed testing
- Check [PHASE6_COMPLETION.md](./PHASE6_COMPLETION.md) for features
- Review [plan.md](./plan.md) for project structure

---

**Happy Coding! 🎉**

