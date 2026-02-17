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

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${backendUrl}/api/admin/auth/refresh`, {}, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    const { token, refreshToken: newRefreshToken, expiresIn } = response.data;
    
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('refreshToken', newRefreshToken);
    sessionStorage.setItem('tokenExpiration', (Date.now() + expiresIn * 1000).toString());
    
    return token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('tokenExpiration');
    window.location.href = '/admin/login?reason=session_expired';
    throw error;
  }
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Don't add token for login and refresh endpoints
    if (config.url && !config.url.includes('/auth/login') && !config.url.includes('/auth/refresh')) {
      const token = sessionStorage.getItem('authToken');
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
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        originalRequest._retry = true;

        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve) => {
            addRefreshSubscriber((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        isRefreshing = true;

        return refreshAccessToken().then((token) => {
          isRefreshing = false;
          onRefreshed(token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      console.warn('Permission denied', error.response.data);
    }

    console.error('API Error:', error);
    return Promise.reject(handleAPIError(error));
  }
);

export default axiosInstance;
