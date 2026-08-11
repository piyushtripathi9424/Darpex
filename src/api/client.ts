import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const isAdminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const token = localStorage.getItem(isAdminPath ? 'admin_jwt_token' : 'jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Ignore 401 on login endpoints so the UI can show the error toast instead of redirecting
      const url = error.config?.url || '';
      if (!url.includes('/login')) {
        // Token expired or invalid, auto logout
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_session');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
