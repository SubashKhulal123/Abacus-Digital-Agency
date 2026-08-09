import axiosInstance from './axiosInstance';

export const adminSettingsApi = {
  get: () => axiosInstance.get('/admin/settings'),
  update: (data) => axiosInstance.patch('/admin/settings', data),
  uploadBrandAsset: (field, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post(`/admin/settings/upload/${field}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getEnvConfig: () => axiosInstance.get('/admin/settings/env-config'),
};
