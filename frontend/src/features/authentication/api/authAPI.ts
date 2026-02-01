import axiosInstance from '../../../shared/api/axiosInstance';
import type { AdminLoginRequest, AdminLoginResponse } from '../types/auth';
import { handleAPIError } from '../../../shared/api/errorHandler';

export const authAPI = {
  login: async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
    try {
      const response = await axiosInstance.post('/api/admin/auth/login', credentials);
      return response.data;
    } catch (err) {
      throw handleAPIError(err);
    }
  },

  refreshToken: async (refreshToken: string): Promise<AdminLoginResponse> => {
    try {
      const response = await axiosInstance.post(
        '/api/admin/auth/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          }
        }
      );
      return response.data;
    } catch (err) {
      throw handleAPIError(err);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/api/admin/auth/logout');
    } catch (err) {
      throw handleAPIError(err);
    }
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      await axiosInstance.get('/api/admin/auth/verify');
      return true;
    } catch {
      return false;
    }
  },
};
