import axiosInstance from './axiosInstance';

export const adminDashboardApi = {
  get: () => axiosInstance.get('/admin/dashboard'),
};
