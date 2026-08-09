import axiosInstance from './axiosInstance';

export const adminMessagesApi = {
  updateStatus: (id, status) => axiosInstance.patch(`/admin/messages/${id}/status`, { status }),
  reply: (id, message) => axiosInstance.post(`/admin/messages/${id}/reply`, { message }),
};
