import axiosInstance from './axiosInstance';

export const categoriesApi = {
  getAll: (params) => axiosInstance.get('/categories', { params }),
};
