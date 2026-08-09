import axiosInstance from './axiosInstance';

export const technologiesApi = {
  getAll: (params) => axiosInstance.get('/technologies', { params }),
};
