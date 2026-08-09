import axiosInstance from './axiosInstance';

export const authApi = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  logout: () => axiosInstance.post('/auth/logout'),
  getMe: () => axiosInstance.get('/auth/me'),
  updateProfile: (payload) => axiosInstance.patch('/auth/profile', payload),
  changePassword: (payload) => axiosInstance.patch('/auth/change-password', payload),
  enableTwoFactor: () => axiosInstance.post('/auth/2fa/enable'),
  disableTwoFactor: (password) => axiosInstance.post('/auth/2fa/disable', { password }),
};
