import apiClient from './apiClient';

export const companyService = {
  getDashboard: async () => {
    const res = await apiClient.get('/company/dashboard');
    return res.data;
  },

  getColleges: async () => {
    const res = await apiClient.get('/company/colleges');
    return res.data;
  },

  getDrives: async () => {
    const res = await apiClient.get('/company/drives');
    return res.data;
  },

  createDrive: async (driveData) => {
    const res = await apiClient.post('/company/drives', driveData);
    return res.data;
  },

  getDriveDetails: async (driveId) => {
    const res = await apiClient.get(`/company/drives/${driveId}`);
    return res.data;
  },

  updateDrive: async (driveId, driveData) => {
    const res = await apiClient.put(`/company/drives/${driveId}`, driveData);
    return res.data;
  },

  inviteColleges: async (driveId, collegeIds) => {
    const res = await apiClient.post(`/company/drives/${driveId}/invite-colleges`, {
      collegeIds,
    });
    return res.data;
  },

  uploadBrochure: async (driveId, file) => {
    const formData = new FormData();
    formData.append('brochure', file);
    const res = await apiClient.post(`/company/drives/${driveId}/brochure`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  getApplicants: async (driveId, params = {}) => {
    const res = await apiClient.get(`/company/drives/${driveId}/applicants`, { params });
    return res.data;
  },

  shortlistApplicants: async (driveId, applicationIds, status) => {
    const res = await apiClient.post(`/company/drives/${driveId}/shortlist`, {
      applicationIds,
      status,
    });
    return res.data;
  },

  advanceRound: async (driveId, applicationIds, roundIndex) => {
    const res = await apiClient.post(`/company/drives/${driveId}/advance-round`, {
      applicationIds,
      roundIndex,
    });
    return res.data;
  },

  issueOffers: async (driveId, applicationIds, offerLetterLinks) => {
    const res = await apiClient.post(`/company/drives/${driveId}/offers`, {
      applicationIds,
      offerLetterLinks,
    });
    return res.data;
  },

  getOffers: async (driveId) => {
    const res = await apiClient.get(`/company/drives/${driveId}/offers`);
    return res.data;
  },

  exportSelected: async (driveId) => {
    const res = await apiClient.get(`/company/drives/${driveId}/export`, {
      responseType: 'blob',
    });
    return res.data;
  },
};

