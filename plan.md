# plan.md

# Project: Campus Hiring & Internship Management Platform (Prototype)

---

## 1. Objective

Build an end-to-end prototype that allows:

✔ Students to apply for hiring drives  
✔ Colleges to manage students and companies  
✔ Companies to conduct multi-college hiring drives  
✔ Email + document workflows for coordination  
✔ Local bare-metal deployment (no cloud infra complexity)  

No future-phase roadmap is included by scope constraint.

---

## 2. Team & Role Assumptions

Team size: **4 members**

| Role | Responsibility |
|---|---|
| FE | React-based web UI |
| BE | Node.js/Express APIs, business logic |
| DB | Mongo schema modeling, queries, indexing |
| Integrations | Email (SMTP), Cloudinary, Docs |

Members may overlap depending on ability.

---

## 3. Architecture Overview (High-level)

Stack: **MERN (React + Node.js + MongoDB + Express)**

Modules:

- Auth & RBAC
- Student UI + Profile + Resume
- College UI + TPO tools + Docs
- Company UI + Drive Management
- Application & Rounds Pipeline
- Offer Workflow
- Notifications (Email + In-app)
- Document Upload (Cloudinary)
- Placement Records
- Reporting (Basic Exports)

---

## 4. Project Phasing Strategy (Role-Based)

Phases:
1. Student Module
2. College Module
3. Company Module
4. Integration & Pipelines
5. Notifications + Documents
6. Testing & Stabilization

Each phase introduces dependencies and unlocks next ones.

---

## 5. Epics, Tasks, Dependencies, Sequencing, Risks

---

# Phase 1: Student Module

### **Epic S1 — Auth & RBAC (Student)**

**Subtasks:**
- S1.1 — User model (role: student)
- S1.2 — JWT auth + refresh
- S1.3 — Password hashing (bcrypt)
- S1.4 — Login/Signup UI forms
- S1.5 — Session handling (FE)
- S1.6 — Protected route guards

**Dependencies:**
- None (initial foundation)

**Risks:**
- JWT misuse or refresh token bugs

**Mitigation:**
- Short-lived access tokens + persistent refresh

---

### **Epic S2 — Student Profile & Resume**

**Subtasks:**
- S2.1 — Student profile schema
- S2.2 — CollegeId binding
- S2.3 — Resume upload UI (Cloudinary)
- S2.4 — Branch, batch, CGPA fields
- S2.5 — Edit profile view
- S2.6 — Resume preview & replace

**Dependencies:**
- Cloudinary integration (Phase 5 prep)

**Risks:**
- Large file uploads / unsupported formats

**Mitigation:**
- Validate (size < 5MB, PDF only)

---

### **Epic S3 — Student Drive Discovery**

**Subtasks:**
- S3.1 — View eligible drives
- S3.2 — Drive detail view
- S3.3 — "Apply" action
- S3.4 — List of applied drives
- S3.5 — Pipeline status UI per application

**Dependencies:**
- Drive creation (Company Phase)

---

### **Epic S4 — Student Status Tracking**

**Subtasks:**
- S4.1 — Dashboard UI
- S4.2 — Status timeline: Applied → Eligible → Shortlisted → R1 → R2 → Offer
- S4.3 — Offer acceptance button
- S4.4 — Offer letter link

**Dependencies:**
- Round + Offer workflows (later phases)

---

### **Deliverables at Phase End**
✔ Students can sign up, upload resumes, apply to drives, view status.

---

# Phase 2: College Module

### **Epic C1 — College Auth & RBAC**

**Subtasks:**
- C1.1 — College user schema (role: college)
- C1.2 — Sign-in (no signup)
- C1.3 — Protected college routes
- C1.4 — TPO dashboard

**Dependencies:**
- Auth base exists from Phase 1

---

### **Epic C2 — Student Management**

**Subtasks:**
- C2.1 — View student list
- C2.2 — Approve/verify profiles
- C2.3 — Edit info for correction
- C2.4 — CSV import (optional)
- C2.5 — Export (basic XLS)

**Dependencies:**
- Student profile (S2)

---

### **Epic C3 — Drive Participation Management**

**Subtasks:**
- C3.1 — Receive company invitations
- C3.2 — Accept/Reject participation
- C3.3 — View drive docs (brochures)
- C3.4 — Eligibility filters (CGPA/branch)
- C3.5 — Push eligible applicants

**Dependencies:**
- Company drive creation (Phase 3)

---

### **Epic C4 — Placement Records**

**Subtasks:**
- C4.1 — Confirm final joins
- C4.2 — Maintain placement table
- C4.3 — Export placement stats (XLS)

**Dependencies:**
- Offer workflow (Phase 4–5)

---

### **Deliverables at Phase End**
✔ College can verify students, join drives, filter eligibility & view placement outcomes.

---

# Phase 3: Company Module

### **Epic P1 — Company Auth & RBAC**

**Subtasks:**
- P1.1 — Company schema
- P1.2 — Company login
- P1.3 — Company dashboard
- P1.4 — Contact details for TPO

**Dependencies:**
- Auth foundation (Phase 1)

---

### **Epic P2 — Drive Creation**

**Subtasks:**
- P2.1 — Job/Role form
- P2.2 — CTC/Stipend fields
- P2.3 — Eligibility input
- P2.4 — Round structure builder:Test → Technical → HR
- P2.5 — Invite colleges list
- P2.6 — Attach brochures (Cloudinary)

**Dependencies:**
- Document storage (Phase 5 prep)

---

### **Epic P3 — Applicant Screening**

**Subtasks:**
- P3.1 — View applicants per college
- P3.2 — Shortlist by criteria
- P3.3 — Bulk select/deselect
- P3.4 — Push round advancement

**Dependencies:**
- Student applications (Phase 1–2)

---

### **Epic P4 — Offer Issuance**

**Subtasks:**
- P4.1 — Upload offer documents
- P4.2 — Issue offer event
- P4.3 — View acknowledgements
- P4.4 — Final selected export

**Dependencies:**
- Round completion

---

### **Deliverables at Phase End**
✔ Companies can create drives, invite colleges, shortlist candidates & issue offers.

---

# Phase 4: Integration & Pipeline

### **Epic I1 — Application Lifecycle Engine**

**State machine:**
APPLIED
→ ELIGIBLE
→ SHORTLISTED
→ ROUND_1
→ ROUND_2
→ FINAL
→ OFFERED
→ ACCEPTED


**Subtasks:**
- I1.1 — Application schema
- I1.2 — Transition rules
- I1.3 — College filters eligibility
- I1.4 — Company moves rounds
- I1.5 — Student acknowledges offer

**Dependencies:**
- S3, C3, P3

---

### **Epic I2 — Rounds Scheduling**

**Subtasks:**
- I2.1 — Add scheduling metadata
- I2.2 — Venue (offline) or link (online)
- I2.3 — Per-college configurations
- I2.4 — Display in student UI
- I2.5 — Event timestamps for audit

---

### **Epic I3 — Joint View Dashboards**

**Subtasks:**
- I3.1 — College view:
  - eligible count
  - shortlisted count
  - offered count
- I3.2 — Company view:
  - per college funnel
- I3.3 — Student timeline view

---

### **Deliverables at Phase End**
✔ Full multi-role hiring flow operational end-to-end.

---

# Phase 5: Notifications + Document Workflows

### **Epic N1 — Email Notifications (SMTP)**

**Subtasks:**
- N1.1 — Nodemailer setup (Gmail SMTP)
- N1.2 — Templates:
  - Shortlist notification
  - Round schedule
  - Offer issued
  - Offer acknowledged
- N1.3 — Retry + logs for failures
- N1.4 — Toggle email on/off for debugging

**Dependencies:**
- Application events implemented

**Risks:**
- Gmail SMTP rate limiting

**Mitigation:**
- Send in batches / low volume expected for prototype

---

### **Epic N2 — In-App Notifications**

**Subtasks:**
- N2.1 — Notifications table
- N2.2 — Student/College/Company feed
- N2.3 — Mark as seen
- N2.4 — Badge indicators in UI

---

### **Epic D1 — Document Uploads (Cloudinary)**

**Scope Items:**
✔ Resume (Student)  
✔ Offer Letters (Company)  
✔ Brochures (Company)  
✔ TPO Docs (College)

**Subtasks:**
- D1.1 — Cloudinary config
- D1.2 — MIME validation
- D1.3 — Upload endpoints
- D1.4 — Secure links
- D1.5 — Preview/download

---

### **Deliverables at Phase End**
✔ Email + documents functional for real-world prototype use.

---

# Phase 6: Testing & Stabilization

### **Epic T1 — Functional Testing**

**Scenarios:**
- Student applies → College filters → Company shortlists → Offer issued
- Multi-college variation
- Docs + email triggered correctly
- Offer acknowledgement loop

---

### **Epic T2 — Data Integrity**

**Checks:**
- Resume persists on reload
- Offers downloadable
- No cross-college leakage
- Round transitions atomic

---

### **Epic T3 — Performance (Prototype-level)**

**Checks:**
- 500–1000 applications → no API degradation
- Bulk shortlist ops < 1s

---

### **Epic T4 — UX Polishing**

**Tasks:**
- Empty states
- Loading indicators
- Pagination
- Error banners
- Form validation

---

### **Final Deliverables**
✔ Functional prototype  
✔ Local deployment instructions  
✔ One end-to-end simulated hiring cycle  
✔ No cloud infra or SLA requirements beyond scope  

---

## 6. Critical Path

Ordering of true blockers:

1. Auth → 2. Profile → 3. Drive → 4. Applications → 5. Rounds → 6. Offers → 7. Emails/Docs

This is the irreversible dependency chain.

---

## 7. Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Email rate limiting | Medium | Low | Batch + retry |
| Cross-role data leaks | Medium | Medium | RBAC + scoped queries |
| Misaligned college-company flow | High | High | Validate with scenarios |
| Resume/document abuse | Low | Medium | MIME validation + size limit |
| Complex UI wiring timeline | Medium | High | Phase isolation by role |
| Prototype exceeds team complexity | Medium | High | Cut optional CSV imports |

---

## 8. Out of Scope (for this plan)

- Mobile apps
- Multi-tenant SaaS hosting
- ATS integrations
- ML-based recommendations
- PPO tracking
- Negotiation workflows
- Video interview APIs
- Background verification

---

## 9. Team Allocation Suggestion

| Member | Primary Focus |
|---|---|
| Dev A | FE (React) |
| Dev B | BE (Express + Workflow) |
| Dev C | DB (Mongo + Schema + Queries) |
| Dev D | Integrations (SMTP + Cloudinary + Downloads) |

Collaboration touchpoints:

- DB ↔ BE for pipeline modeling
- BE ↔ FE for APIs
- Integrations ↔ all roles for docs/emails

---

## 10. Completion Criteria

✔ All roles can perform expected actions  
✔ One complete hiring cycle demonstrated locally  
✔ Offers + emails + documents functional  
✔ Status transitions visible to all roles  
✔ No role sees disallowed data  
✔ Prototype works without cloud infra except Cloudinary