import apiClient from './apiClient';

export const collegeService = {
  getDashboard: async () => {
    const res = await apiClient.get('/college/dashboard');
    return res.data;
  },

  getStudents: async (params = {}) => {
    const res = await apiClient.get('/college/students', { params });
    return res.data;
  },

  verifyStudent: async (studentId) => {
    const res = await apiClient.put(`/college/students/${studentId}/verify`);
    return res.data;
  },

  updateStudent: async (studentId, payload) => {
    const res = await apiClient.put(`/college/students/${studentId}`, payload);
    return res.data;
  },

  exportStudents: async () => {
    const res = await apiClient.get('/college/students/export', {
      responseType: 'blob',
    });
    return res.data;
  },

  getDrives: async () => {
    const res = await apiClient.get('/college/drives');
    return res.data;
  },

  respondToInvite: async (driveCollegeId, action) => {
    const res = await apiClient.post(
      `/college/drives/${driveCollegeId}/respond`,
      { action }
    );
    return res.data;
  },

  pushEligibleApplicants: async (driveId) => {
    const res = await apiClient.post(`/college/drives/${driveId}/push-eligible`);
    return res.data;
  },
};

export const placementService = {
  confirmPlacement: async (applicationId, joiningStatus) => {
    const res = await apiClient.post('/placement/confirm', {
      applicationId,
      joiningStatus,
    });
    return res.data;
  },

  getPlacements: async () => {
    const res = await apiClient.get('/placement');
    return res.data;
  },

  exportPlacements: async () => {
    const res = await apiClient.get('/placement/export', {
      responseType: 'blob',
    });
    return res.data;
  },
};
