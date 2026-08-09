import axiosInstance from './axiosInstance';

export const searchApi = {
  search: (q) => axiosInstance.get('/search', { params: { q } }),
};
