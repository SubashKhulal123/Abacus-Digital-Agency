import axiosInstance from './axiosInstance';

export const adminNewsletterApi = {
  import: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/admin/newsletter/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
