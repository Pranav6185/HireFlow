// User Roles
exports.ROLES = {
  STUDENT: 'student',
  COLLEGE: 'college',
  COMPANY: 'company',
};

// Application Status
exports.APPLICATION_STATUS = {
  APPLIED: 'APPLIED',
  ELIGIBLE: 'ELIGIBLE',
  SHORTLISTED: 'SHORTLISTED',
  ROUND_1: 'ROUND_1',
  ROUND_2: 'ROUND_2',
  FINAL: 'FINAL',
  OFFERED: 'OFFERED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
  ABSENT: 'ABSENT',
  NO_OFFER: 'NO_OFFER',
};

// Drive Participation Status
exports.PARTICIPATION_STATUS = {
  INVITED: 'Invited',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

// Round Types
exports.ROUND_TYPES = {
  TEST: 'Test',
  INTERVIEW: 'Interview',
  TECHNICAL: 'Technical',
  HR: 'HR',
  CUSTOM: 'Custom',
};

// JWT Token Expiry
exports.TOKEN_EXPIRY = {
  ACCESS: '15m',
  REFRESH: '7d',
};

