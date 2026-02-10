import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { handleAPIError } from './errorHandler';

// Create axios instance
let backendUrl = import.meta.env.VITE_BACKEND_URL || '';

// Convert HTTPS to HTTP for localhost development
if (backendUrl.startsWith('https://localhost') || backendUrl.startsWith('https://127.0.0.1')) {
  backendUrl = backendUrl.replace('https://', 'http://');
}

// Create axios instance
const axiosInstance = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'X-Content-Type-Options': 'nosniff'
  },
  withCredentials: false,
});


axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Don't add token for login endpoint
    if (config.url && !config.url.includes('/auth/login') && !config.url.includes('/auth/refresh')) {
      const token = sessionStorage.getItem('authToken');
      const tokenExpiration = sessionStorage.getItem('tokenExpiration');
      
      // Check if token is about to expire (within 5 minutes) and refresh it
      if (token && tokenExpiration) {
        const expirationTime = parseInt(tokenExpiration, 10);
        const timeUntilExpiration = expirationTime - Date.now();
        
        if (timeUntilExpiration < 5 * 60 * 1000) { // 5 minutes
          const refreshToken = sessionStorage.getItem('refreshToken');
          if (refreshToken) {
            // Attempt to refresh token (this will be handled asynchronously)
            // For now, we'll continue with the current token
            console.warn('⚠️ Token expiring soon, consider refreshing');
          }
        }
      }
      
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
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('adminUser');

      // Redirect to login
      window.location.href = '/admin/login?reason=session_expired';
    } else if (error.response?.status === 403) {
      // 403 Forbidden - permission denied
      console.warn('Permission denied', error.response.data);
    }

    console.error('API Error:', error);
    return Promise.reject(handleAPIError(error));
  }
);

export default axiosInstance;
