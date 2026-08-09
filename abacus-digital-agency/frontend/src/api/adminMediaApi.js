import axiosInstance from './axiosInstance';

export const adminMediaApi = {
  upload: (file, extra = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(extra).forEach(([key, value]) => formData.append(key, value));
    return axiosInstance.post('/admin/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
