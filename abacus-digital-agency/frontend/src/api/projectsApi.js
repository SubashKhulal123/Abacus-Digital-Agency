import axiosInstance from './axiosInstance';

export const projectsApi = {
  getAll: (params) => axiosInstance.get('/projects', { params }),
  getBySlug: (slug) => axiosInstance.get(`/projects/${slug}`),
};
