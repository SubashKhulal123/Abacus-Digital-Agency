import axiosInstance from './axiosInstance';

/**
 * Maps a short resource key (used throughout the admin UI and router) to
 * its backend admin API path. Centralizing this mapping means every
 * generic admin component just needs a `resourceKey`, never a hardcoded
 * URL string.
 */
export const RESOURCE_PATHS = {
  developers: '/admin/developers',
  services: '/admin/services',
  projects: '/admin/projects',
  blogs: '/admin/blogs',
  testimonials: '/admin/testimonials',
  clients: '/admin/clients',
  technologies: '/admin/technologies',
  categories: '/admin/categories',
  faqs: '/admin/faqs',
  statistics: '/admin/statistics',
  jobs: '/admin/jobs',
  applications: '/admin/applications',
  messages: '/admin/messages',
  newsletter: '/admin/newsletter',
  media: '/admin/media',
};

/**
 * Generic CRUD client for any admin resource. All admin list/detail
 * pages are built on top of this — no resource needs a bespoke API file
 * unless it has genuinely non-CRUD behavior (which lives in its own
 * dedicated api module instead, e.g. dashboardApi, settingsApi).
 */
export const createAdminResourceApi = (resourceKey) => {
  const basePath = RESOURCE_PATHS[resourceKey];
  if (!basePath) throw new Error(`Unknown admin resource key: "${resourceKey}"`);

  return {
    list: (params) => axiosInstance.get(basePath, { params }),
    getOne: (id) => axiosInstance.get(`${basePath}/${id}`),
    create: (data, isMultipart = false) =>
      axiosInstance.post(basePath, data, isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined),
    update: (id, data, isMultipart = false) =>
      axiosInstance.patch(`${basePath}/${id}`, data, isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined),
    remove: (id) => axiosInstance.delete(`${basePath}/${id}`),
    bulkRemove: (ids) => axiosInstance.delete(`${basePath}/bulk`, { data: { ids } }),
    exportCSV: () => axiosInstance.get(`${basePath}/export`, { responseType: 'blob' }),
  };
};
