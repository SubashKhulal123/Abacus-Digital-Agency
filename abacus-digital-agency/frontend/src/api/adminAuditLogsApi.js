import axiosInstance from './axiosInstance';

export const adminAuditLogsApi = {
  list: (params) => axiosInstance.get('/admin/audit-logs', { params }),
};
