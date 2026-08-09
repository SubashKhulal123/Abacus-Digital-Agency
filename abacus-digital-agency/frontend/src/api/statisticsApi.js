import axiosInstance from './axiosInstance';

export const statisticsApi = {
  getAll: () => axiosInstance.get('/statistics'),
};
