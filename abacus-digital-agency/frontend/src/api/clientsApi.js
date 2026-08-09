import axiosInstance from './axiosInstance';

export const clientsApi = {
  getAll: () => axiosInstance.get('/clients'),
};
