import axiosInstance from './axiosInstance';

export const adminNotificationsApi = {
  list: () => axiosInstance.get('/admin/notifications'),
  markRead: (id) => axiosInstance.patch(`/admin/notifications/${id}/read`),
  markAllRead: () => axiosInstance.patch('/admin/notifications/read-all'),
};
