import axiosInstance from './axiosInstance';

export const adminBackupApi = {
  download: () => axiosInstance.get('/admin/backup', { responseType: 'blob' }),
};
