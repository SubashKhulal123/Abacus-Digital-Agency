import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { developersApi } from '@api/developersApi';
import { projectsApi } from '@api/projectsApi';
import { servicesApi } from '@api/servicesApi';
import { testimonialsApi } from '@api/testimonialsApi';
import { blogsApi } from '@api/blogsApi';
import { categoriesApi } from '@api/categoriesApi';
import { technologiesApi } from '@api/technologiesApi';
import { clientsApi } from '@api/clientsApi';
import { faqsApi } from '@api/faqsApi';
import { statisticsApi } from '@api/statisticsApi';
import { jobsApi } from '@api/jobsApi';
import { settingsApi } from '@api/settingsApi';
import { contactApi } from '@api/contactApi';
import { newsletterApi } from '@api/newsletterApi';
import { careersApi } from '@api/careersApi';

// ---------------------------------------------------------------------------
// Site settings (branding, about content, values, process, pricing, etc.)
// ---------------------------------------------------------------------------
export function useSiteSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.get().then((res) => res.data),
    staleTime: 10 * 60 * 1000,
  });
}

// ---------------------------------------------------------------------------
// Developers / Team
// ---------------------------------------------------------------------------
export function useDevelopers(params = {}) {
  return useQuery({
    queryKey: ['developers', params],
    queryFn: () => developersApi.getAll(params).then((res) => res.data),
  });
}

export function useDeveloper(slug) {
  return useQuery({
    queryKey: ['developer', slug],
    queryFn: () => developersApi.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

// ---------------------------------------------------------------------------
// Projects / Portfolio
// ---------------------------------------------------------------------------
export function useProjects(params = {}) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsApi.getAll(params).then((res) => res),
  });
}

export function useProject(slug) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectsApi.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export function useServices(params = {}) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => servicesApi.getAll(params).then((res) => res.data),
  });
}

export function useService(slug) {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: () => servicesApi.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
export function useTestimonials(params = {}) {
  return useQuery({
    queryKey: ['testimonials', params],
    queryFn: () => testimonialsApi.getAll(params).then((res) => res.data),
  });
}

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------
export function useBlogs(params = {}) {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: () => blogsApi.getAll(params).then((res) => res),
  });
}

export function useBlog(slug) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogsApi.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

/**
 * Infinite-scroll variant of the blog listing — each page appends to the
 * previous rather than replacing it. `getNextPageParam` reads the
 * backend's `meta.totalPages` to know when to stop.
 */
export function useInfiniteBlogs(params = {}) {
  return useInfiniteQuery({
    queryKey: ['blogs', 'infinite', params],
    queryFn: ({ pageParam = 1 }) => blogsApi.getAll({ ...params, page: pageParam }).then((res) => res),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta || {};
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function useLikeBlog() {
  return useMutation({ mutationFn: (id) => blogsApi.like(id) });
}

// ---------------------------------------------------------------------------
// Categories / Technologies / Clients
// ---------------------------------------------------------------------------
export function useCategories(type) {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => categoriesApi.getAll(type ? { type } : {}).then((res) => res.data),
  });
}

export function useTechnologies(params = {}) {
  return useQuery({
    queryKey: ['technologies', params],
    queryFn: () => technologiesApi.getAll(params).then((res) => res.data),
  });
}

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsApi.getAll().then((res) => res.data),
  });
}

// ---------------------------------------------------------------------------
// FAQs / Statistics
// ---------------------------------------------------------------------------
export function useFaqs(category) {
  return useQuery({
    queryKey: ['faqs', category],
    queryFn: () => faqsApi.getAll(category ? { category } : {}).then((res) => res.data),
  });
}

export function useStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: () => statisticsApi.getAll().then((res) => res.data),
  });
}

// ---------------------------------------------------------------------------
// Jobs / Careers
// ---------------------------------------------------------------------------
export function useJobs(params = {}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsApi.getAll(params).then((res) => res.data),
  });
}

export function useJob(slug) {
  return useQuery({
    queryKey: ['job', slug],
    queryFn: () => jobsApi.getBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
}

export function useApplyToJob() {
  return useMutation({ mutationFn: (formData) => careersApi.apply(formData) });
}

// ---------------------------------------------------------------------------
// Contact / Newsletter
// ---------------------------------------------------------------------------
export function useSubmitContact() {
  return useMutation({ mutationFn: (payload) => contactApi.submit(payload) });
}

export function useSubscribeNewsletter() {
  return useMutation({ mutationFn: (payload) => newsletterApi.subscribe(payload) });
}
