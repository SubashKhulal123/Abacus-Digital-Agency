import axiosInstance from './axiosInstance';

export const contactApi = {
  submit: (payload) => axiosInstance.post('/contact', payload),
};
