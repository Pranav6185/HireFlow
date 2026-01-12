import apiClient from './apiClient';

export const studentService = {
  getProfile: async () => {
    const response = await apiClient.get('/students/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/students/profile', profileData);
    return response.data;
  },

  updateResume: async (resumeLink) => {
    const response = await apiClient.put('/students/resume', { resumeLink });
    return response.data;
  },

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await apiClient.post('/students/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const driveService = {
  getEligibleDrives: async () => {
    const response = await apiClient.get('/drives/eligible');
    return response.data;
  },

  getDriveDetails: async (driveId) => {
    const response = await apiClient.get(`/drives/${driveId}`);
    return response.data;
  },
};

export const applicationService = {
  submitApplication: async (driveId) => {
    const response = await apiClient.post('/applications/submit', { driveId });
    return response.data;
  },

  getMyApplications: async () => {
    const response = await apiClient.get('/applications/my-applications');
    return response.data;
  },

  getApplicationStatus: async (applicationId) => {
    const response = await apiClient.get(`/applications/${applicationId}`);
    return response.data;
  },
};

