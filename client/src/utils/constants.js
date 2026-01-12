// API Base URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Application Status
export const APPLICATION_STATUS = {
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

// User Roles
export const ROLES = {
  STUDENT: 'student',
  COLLEGE: 'college',
  COMPANY: 'company',
};

