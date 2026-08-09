import axiosInstance from './axiosInstance';

export const developersApi = {
  getAll: (params) => axiosInstance.get('/developers', { params }),
  getBySlug: (slug) => axiosInstance.get(`/developers/${slug}`),
};
