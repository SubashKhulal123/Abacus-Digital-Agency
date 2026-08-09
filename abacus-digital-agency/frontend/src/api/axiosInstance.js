import axios from 'axios';

/**
 * VITE_API_URL should point to the backend's versioned API root,
 * e.g. http://localhost:5000/api/v1 in development.
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // sends the httpOnly JWT cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach a bearer token from memory/local state if present (fallback path
// for non-cookie clients); cookie auth is the primary mechanism.
axiosInstance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('abacus-admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses into a consistent shape so calling code
// never has to guess between err.response.data.message vs err.message.
axiosInstance.interceptors.response.use(
  (response) => response.data, // unwrap { success, statusCode, message, data } automatically
  (error) => {
    const normalized = {
      statusCode: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.',
      errors: error.response?.data?.errors || [],
      isNetworkError: !error.response,
    };
    return Promise.reject(normalized);
  }
);

export default axiosInstance;
