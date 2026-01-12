# Problem Statement

Build a prototype of a multi-role Campus Hiring & Internship Management Platform that enables companies to conduct hiring drives across one or more colleges, allows colleges to manage student eligibility and coordination, and provides students with transparent application and status tracking. The system must support per-college participation, round-based evaluations, structured status transitions, and offer issuance, while maintaining separation of responsibilities between company and college workflows.

---

# Functional Requirements

- **R1**: Support hiring drive creation by companies with configurable job roles, eligibility criteria, and round structures.
- **R2**: Allow companies to invite specific colleges to participate in a drive and allow colleges to accept or reject participation.
- **R3**: Enable colleges to manage student records and validate eligibility before students apply.
- **R4**: Support structured application pipelines with explicit round stages (e.g., Test → Technical → HR → Offer).
- **R5**: Allow companies to shortlist candidates at each round, optionally filtered per college.
- **R6**: Allow colleges to coordinate on-campus and virtual logistics for scheduled rounds.
- **R7**: Provide students with transparent status visibility for every stage of the hiring pipeline.
- **R8**: Support offer issuance, download, and acknowledgement within the platform.
- **R9**: Persist placement information for colleges to compute reports and statistics.
- **R10**: Support multi-college drives where a single company conducts independent pipelines per college.
- **R11**: Allow colleges to maintain placement data without exposing confidential student information across institutions.
- **R12**: Provide structured export formats (XLS/PDF) for company and college reporting requirements.
- **R13**: Record timeline events for auditability of decisions (e.g., shortlist time, offer time, accept time).
- **R14**: Provide safety behaviors for conflicting updates between company and college actions.

### Email & Notification Requirements (Added)

- **R15**: Support email notifications for critical lifecycle events (e.g., shortlist announcements, round invites, offers).
- **R16**: Allow colleges to broadcast announcements via email and in-app notifications to participating students.
- **R17**: Allow companies to schedule interview/test communications via email with contextual metadata (venue, mode, instructions).
- **R18**: Track delivery for offer-related emails to ensure acknowledgement.
- **R19**: Provide in-app fallback notifications for non-critical updates.

---

# Non-Functional Requirements

## Performance
- Must support thousands of applications per drive without degrading round transitions.
- Drive and round status updates must propagate in real-time or near real-time when online.
- Export operations must complete within acceptable latency for typical college datasets.
- Bulk email sends (500–2000) must be handled asynchronously without blocking workflow actions.

## Security
- Student data must be invisible to other colleges in multi-campus drives.
- Salary and offer details must be permissions-restricted.
- Audit logs must capture decision-critical actions by company and college roles.
- Access control must enforce strict role boundaries (Company vs College vs Student).

## Reliability (Added)
- Email delivery must be retried on temporary transmission failures.
- Offer-related communications must be durably recorded for audit.
- In-app notifications must serve as fallback for delayed or failed sends.

## Scalability
- Architecture must support N companies × M colleges with no direct coupling.
- Drive model must scale to cross-year multi-batch participation.
- Round definitions must allow insertion of additional rounds without schema redesign.

---

# Constraints

- **Mode of Operation**: Primarily online, with degraded operation support for temporarily disconnected college devices (TPO workflows).
- **Data Residency**: Student placement and offer data must remain accessible post-drive for institutional reporting.
- **Backward Compatibility**: Drive configuration updates must not invalidate existing applications.
- **Interoperability**: Export formats must match typical TPO/HR workflows (Excel/PDF/CSV).
- **Compliance**: Email templates must avoid exposing cross-college student data.

---

# Architecture Decisions

- Drives are modeled as **multi-participant workflows** rather than job postings to reflect campus hiring reality.
- Per-college mapping is explicit to handle participation acceptance, eligibility, and filtering without shared data leaks.
- Students apply within the context of a college-drive relationship, not globally.
- Round evaluations are modeled as state transitions with per-round outcomes rather than binary applicant states.
- Offers are decoupled from selection flows to support delayed issuance, negotiation, or headcount constraints.
- Exports and analytics are modeled as read-optimized views to avoid performance degradation on primary workflows.
- Email delivery is treated as an **event-driven side-channel** to hiring workflows, not synchronous blocking behavior.
- Critical email events (e.g., offer release) require durable delivery attempts and audit trails.
- Non-critical messaging (e.g., reminders) may be best-effort.

---

# Data Models / APIs

## Core Entities

### Student
- id
- name
- email
- collegeId
- branch
- batch (YOP)
- cgpa
- resumeLink

### College
- id
- name
- location
- departments
- tpoContacts

### Company
- id
- name
- domain
- recruiterContacts

### Drive
- id
- companyId
- role
- ctc / stipend
- mode (on-campus / virtual / pooled)
- roundStructure
- eligibilityCriteria

### DriveCollege
- driveId
- collegeId
- participationStatus (Invited / Accepted / Rejected / Withdrawn)

### Application
- studentId
- driveId
- collegeId
- status
- submittedAt

### Round
- driveId
- index
- title
- type (Test / Interview / HR / Custom)
- schedulingInfo

### RoundDecision
- applicationId
- roundIndex
- outcome (Passed / Failed / Absent)
- updatedAt

### Offer
- applicationId
- offerLetterLink
- issuedAt
- acknowledgedAt

### PlacementRecord
- studentId
- driveId
- offerAccepted
- joiningStatus

### Notification (Added)
- userId
- channel (email / in-app)
- type (critical / informational / broadcast)
- payload
- deliveryStatus
- createdAt

---

## Event Model (Added)

Internal Events include:
DRIVE_ACCEPTED_BY_COLLEGE
ROUND_SCHEDULED
ROUND_RESULT_PUBLISHED
OFFER_ISSUED
OFFER_ACKNOWLEDGED
BROADCAST_ANNOUNCEMENT


Each event may trigger:
- sendEmail()
- sendInAppNotification()
- enqueueRetry()

---

# APIs (Business Action-Oriented)

### POST /drive/create
Creates hiring drive and config.

### POST /drive/invite-colleges
Invites colleges for participation.

### POST /drive/college/respond
College accepts or rejects participation.

### GET /drive/applications
Returns applicants segmented per college.

### POST /application/submit
Student applies after validation.

### POST /round/start
Initiates a hiring round.

### POST /round/decision
Records outcomes for a round.

### POST /offer/issue
Issues offer letters + triggers critical event.

### POST /offer/acknowledge
Student acknowledges acceptance.

### GET /placement/report
Returns placement analytics for colleges.

### POST /announcement/broadcast (Added)
College broadcasts announcements to students.

### POST /notification/resend (Added)
Retries delivery for critical communications.

---

# Application Pipeline
APPLIED → ELIGIBLE → SHORTLISTED → ROUND_1 → ROUND_2 → ... → FINAL → OFFERED → ACCEPTED


# Terminal outcomes:
REJECTED
WITHDRAWN
ABSENT
NO_OFFER

# Edge Cases

- Multi-college invite with partial acceptance.
- College filters out ineligible students before application.
- Student applies but misses a test round.
- Offers delayed despite final selections.
- Student rejects offer; seat optionally reallocated.
- Mid-drive eligibility change without retro-removal.
- Offer issued but not acknowledged.
- College withdraws during an active drive.
- Email delivery failure due to invalid address.
- Delayed retries due to mail server throttling.
- Cross-institution spam filtering for bulk mail.
- Student updates email mid-drive (requires verification).
