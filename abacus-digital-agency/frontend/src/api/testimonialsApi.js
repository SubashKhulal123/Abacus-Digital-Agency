import axiosInstance from './axiosInstance';

export const testimonialsApi = {
  getAll: (params) => axiosInstance.get('/testimonials', { params }),
};
