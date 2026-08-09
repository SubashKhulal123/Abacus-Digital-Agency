import axiosInstance from './axiosInstance';

export const faqsApi = {
  getAll: (params) => axiosInstance.get('/faqs', { params }),
};
