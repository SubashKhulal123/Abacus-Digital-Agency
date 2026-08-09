import axiosInstance from './axiosInstance';

export const jobsApi = {
  getAll: (params) => axiosInstance.get('/careers/jobs', { params }),
  getBySlug: (slug) => axiosInstance.get(`/careers/jobs/${slug}`),
};
