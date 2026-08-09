import axiosInstance from './axiosInstance';

export const blogsApi = {
  getAll: (params) => axiosInstance.get('/blogs', { params }),
  getBySlug: (slug) => axiosInstance.get(`/blogs/${slug}`),
  like: (id) => axiosInstance.post(`/blogs/${id}/like`),
};
