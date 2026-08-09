import axiosInstance from './axiosInstance';

export const servicesApi = {
  getAll: (params) => axiosInstance.get('/services', { params }),
  getBySlug: (slug) => axiosInstance.get(`/services/${slug}`),
};
