import axiosInstance from './axiosInstance';

export const newsletterApi = {
  subscribe: (payload) => axiosInstance.post('/newsletter/subscribe', payload),
};
