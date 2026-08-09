import axiosInstance from './axiosInstance';

export const adminLogsApi = {
  get: (params) => axiosInstance.get('/admin/logs', { params }),
};
