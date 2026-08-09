import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdminResourceApi } from '@api/adminResourceApi';

export function useAdminList(resourceKey, params = {}) {
  const api = createAdminResourceApi(resourceKey);
  return useQuery({
    queryKey: ['admin', resourceKey, 'list', params],
    queryFn: () => api.list(params),
    keepPreviousData: true,
  });
}

export function useAdminOne(resourceKey, id) {
  const api = createAdminResourceApi(resourceKey);
  return useQuery({
    queryKey: ['admin', resourceKey, 'one', id],
    queryFn: () => api.getOne(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useAdminCreate(resourceKey) {
  const api = createAdminResourceApi(resourceKey);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, isMultipart }) => api.create(data, isMultipart),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] }),
  });
}

export function useAdminUpdate(resourceKey) {
  const api = createAdminResourceApi(resourceKey);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, isMultipart }) => api.update(id, data, isMultipart),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] }),
  });
}

export function useAdminRemove(resourceKey) {
  const api = createAdminResourceApi(resourceKey);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] }),
  });
}

export function useAdminBulkRemove(resourceKey) {
  const api = createAdminResourceApi(resourceKey);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => api.bulkRemove(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] }),
  });
}

export function useAdminExportCSV(resourceKey) {
  const api = createAdminResourceApi(resourceKey);
  return useMutation({
    mutationFn: async () => {
      const blob = await api.exportCSV();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resourceKey}-export.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}
