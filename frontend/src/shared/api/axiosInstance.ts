import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});


axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Don't add token for login endpoint
    if (config.url && !config.url.includes('/auth/login')) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {

      console.warn('Session expired - redirecting to login');
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');

      // Redirect to login
      window.location.href = '/admin/login?reason=session_expired';
    } else if (error.response?.status === 403) {
      // 403 Forbidden - permission denied
      console.warn('Permission denied', error.response.data);
    }

    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
