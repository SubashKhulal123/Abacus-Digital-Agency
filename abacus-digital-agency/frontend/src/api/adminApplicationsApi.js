import axiosInstance from './axiosInstance';

export const adminApplicationsApi = {
  updateStatus: (id, status, notifyApplicant = false) =>
    axiosInstance.patch(`/admin/applications/${id}/status`, { status, notifyApplicant }),
};
