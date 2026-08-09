import axiosInstance from './axiosInstance';

export const careersApi = {
  apply: (formData) =>
    axiosInstance.post('/careers/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
