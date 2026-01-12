# Functional Test Scenarios - Phase 6

This document outlines the test scenarios for validating the end-to-end hiring workflow.

## Test Environment Setup

1. Ensure MongoDB is running
2. Start the server: `cd server && npm run dev`
3. Start the client: `cd client && npm start`
4. Use Postman or similar tool for API testing

## Test Scenarios

### Scenario 1: Complete Hiring Flow (Single College)

**Objective**: Test the complete flow from drive creation to offer acceptance

**Steps**:
1. **Company creates a drive**
   - POST `/api/company/drives`
   - Verify drive is created with status 'draft'
   - Verify eligibility criteria are saved

2. **Company invites college**
   - POST `/api/company/drives/:driveId/invite-colleges`
   - Verify college receives invitation

3. **College accepts invitation**
   - POST `/api/college/drives/:driveCollegeId/respond`
   - Set action: 'accept'
   - Verify participation status is 'Accepted'

4. **College pushes eligible students**
   - POST `/api/college/drives/:driveId/push-eligible`
   - Verify students are marked as ELIGIBLE

5. **Student applies**
   - POST `/api/applications/submit`
   - Verify application status is APPLIED
   - Verify timeline entry is created

6. **Company shortlists candidates**
   - POST `/api/company/drives/:driveId/shortlist`
   - Verify status changes to SHORTLISTED
   - Verify timeline entry

7. **Company advances to rounds**
   - POST `/api/company/drives/:driveId/advance-round`
   - Verify status changes to ROUND_1, ROUND_2, etc.

8. **Company issues offers**
   - POST `/api/company/drives/:driveId/issue-offers`
   - Verify offers are created
   - Verify application status is OFFERED

9. **Student acknowledges offer**
   - POST `/api/applications/:applicationId/acknowledge-offer`
   - Verify offer is acknowledged
   - Verify application status is ACCEPTED

**Expected Results**:
- All status transitions work correctly
- Timeline entries are created for each transition
- No data leakage between colleges
- Email notifications are sent (if configured)

---

### Scenario 2: Multi-College Drive

**Objective**: Test drive with multiple colleges

**Steps**:
1. Create drive and invite 2+ colleges
2. College A accepts, College B rejects
3. Verify only College A students can see the drive
4. Verify College B students cannot see the drive
5. Verify company can filter applicants by college

**Expected Results**:
- College isolation is maintained
- Company can view applicants per college
- No cross-college data leakage

---

### Scenario 3: Data Integrity Checks

**Objective**: Verify data persistence and integrity

**Checks**:
1. **Resume Persistence**
   - Upload resume
   - Reload page
   - Verify resume link persists

2. **Offer Download**
   - Issue offer with offer letter link
   - Verify link is accessible
   - Verify offer persists after reload

3. **Cross-College Leakage**
   - Create two colleges with students
   - Create drive for College A only
   - Verify College B students cannot see drive
   - Verify College B students cannot apply

4. **Atomic Round Transitions**
   - Shortlist multiple applicants
   - Verify all are updated atomically
   - Verify no partial updates

**Expected Results**:
- All data persists correctly
- No cross-college data access
- Operations are atomic

---

### Scenario 4: Performance Test (500-1000 Applications)

**Objective**: Verify system handles large datasets

**Steps**:
1. Create drive
2. Create 500-1000 test applications (via script)
3. Test pagination on applicant list
4. Test bulk shortlist operation
5. Measure response times

**Expected Results**:
- Pagination works correctly
- Bulk operations complete < 1s
- No API degradation

---

### Scenario 5: Email & Document Workflow

**Objective**: Verify email notifications and document handling

**Steps**:
1. Configure email service (SMTP)
2. Shortlist student
3. Verify email is sent
4. Issue offer
5. Verify offer email is sent
6. Upload offer letter document
7. Verify document is accessible

**Expected Results**:
- Emails are sent for critical events
- Documents are uploaded and accessible
- Email failures don't block workflow

---

## Test Data Setup

### Create Test Users

```javascript
// Student
POST /api/auth/signup
{
  "email": "student1@test.com",
  "password": "password123",
  "role": "student",
  "name": "Test Student",
  "collegeId": "<college_id>",
  "branch": "CSE",
  "batch": "2024",
  "cgpa": 8.5
}

// College (manual DB entry or admin endpoint)
// Company (manual DB entry or admin endpoint)
```

### Create Test Drive

```javascript
POST /api/company/drives
{
  "role": "Software Engineer",
  "ctc": 12,
  "mode": "on-campus",
  "roundStructure": [
    { "index": 0, "title": "Aptitude Test", "type": "Test" },
    { "index": 1, "title": "Technical Interview", "type": "Interview" },
    { "index": 2, "title": "HR Interview", "type": "HR" }
  ],
  "eligibilityCriteria": {
    "minCGPA": 7.0,
    "allowedBranches": ["CSE", "IT", "ECE"],
    "batch": "2024"
  },
  "collegeIds": ["<college_id>"]
}
```

---

## Automated Test Script

See `test-script.js` for automated test execution.

