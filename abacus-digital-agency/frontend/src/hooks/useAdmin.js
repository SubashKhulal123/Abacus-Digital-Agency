import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminDashboardApi } from '@api/adminDashboardApi';
import { adminSettingsApi } from '@api/adminSettingsApi';
import { adminMessagesApi } from '@api/adminMessagesApi';
import { adminApplicationsApi } from '@api/adminApplicationsApi';
import { adminNewsletterApi } from '@api/adminNewsletterApi';
import { adminAuditLogsApi } from '@api/adminAuditLogsApi';
import { adminNotificationsApi } from '@api/adminNotificationsApi';
import { adminLogsApi } from '@api/adminLogsApi';
import { adminBackupApi } from '@api/adminBackupApi';
import { adminMediaApi } from '@api/adminMediaApi';
import { authApi } from '@api/authApi';

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminDashboardApi.get().then((res) => res.data),
    refetchInterval: 60 * 1000,
  });
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => adminSettingsApi.get().then((res) => res.data),
  });
}

export function useAdminEnvConfig() {
  return useQuery({
    queryKey: ['admin', 'settings', 'env-config'],
    queryFn: () => adminSettingsApi.getEnvConfig().then((res) => res.data),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => adminSettingsApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

export function useUploadBrandAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ field, file }) => adminSettingsApi.uploadBrandAsset(field, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => adminMessagesApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] }),
  });
}

export function useReplyToMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }) => adminMessagesApi.reply(id, message),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] }),
  });
}

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------
export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, notifyApplicant }) =>
      adminApplicationsApi.updateStatus(id, status, notifyApplicant),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] }),
  });
}

// ---------------------------------------------------------------------------
// Newsletter import
// ---------------------------------------------------------------------------
export function useImportNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => adminNewsletterApi.import(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter'] }),
  });
}

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------
export function useAuditLogs(params = {}) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: () => adminAuditLogsApi.list(params),
    keepPreviousData: true,
  });
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export function useAdminNotifications() {
  return useQuery({
    queryKey: ['admin', 'notifications'],
    queryFn: () => adminNotificationsApi.list(),
    refetchInterval: 30 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminNotificationsApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminNotificationsApi.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] }),
  });
}

// ---------------------------------------------------------------------------
// Logs
// ---------------------------------------------------------------------------
export function useAdminLogs(params = {}) {
  return useQuery({
    queryKey: ['admin', 'logs', params],
    queryFn: () => adminLogsApi.get(params).then((res) => res.data),
  });
}

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------
export function useDownloadBackup() {
  return useMutation({
    mutationFn: async () => {
      const blob = await adminBackupApi.download();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `abacus-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}

// ---------------------------------------------------------------------------
// Media Library
// ---------------------------------------------------------------------------
export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, extra }) => adminMediaApi.upload(file, extra),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'media'] }),
  });
}

// ---------------------------------------------------------------------------
// Two-Factor
// ---------------------------------------------------------------------------
export function useEnableTwoFactor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.enableTwoFactor(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });
}

export function useDisableTwoFactor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (password) => authApi.disableTwoFactor(password),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth', 'me'] }),
  });
}
