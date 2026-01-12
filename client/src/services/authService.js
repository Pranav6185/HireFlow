import apiClient from './apiClient';

export const authService = {
  signup: async (studentData) => {
    const response = await apiClient.post('/auth/signup', studentData);
    return response.data;
  },

  signupCompany: async (companyData) => {
    const response = await apiClient.post('/auth/signup/company', companyData);
    return response.data;
  },

  signupCollege: async (collegeData) => {
    const response = await apiClient.post('/auth/signup/college', collegeData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

