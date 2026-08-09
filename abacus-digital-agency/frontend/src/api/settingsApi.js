import axiosInstance from './axiosInstance';

export const settingsApi = {
  get: () => axiosInstance.get('/settings'),
};
