import { create } from 'zustand';
import type { AdminUser } from '../types/auth';

interface AuthStore {
  adminUser: AdminUser | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiration: number | null;
  isAuthenticated: boolean;
  setAuth: (user: AdminUser, token: string, refreshToken: string, expiresIn: number) => void;
  logout: () => void;
  initializeFromStorage: () => void;
  updateTokens: (token: string, refreshToken: string, expiresIn: number) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  adminUser: null,
  token: null,
  refreshToken: null,
  tokenExpiration: null,
  isAuthenticated: false,

  setAuth: (user: AdminUser, token: string, refreshToken: string, expiresIn: number) => {
    const expirationTime = Date.now() + expiresIn * 1000;
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('adminUser', JSON.stringify(user));
    sessionStorage.setItem('tokenExpiration', expirationTime.toString());
    set({
      adminUser: user,
      token,
      refreshToken,
      tokenExpiration: expirationTime,
      isAuthenticated: true,
    });
  },

  logout: () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('tokenExpiration');
    set({
      adminUser: null,
      token: null,
      refreshToken: null,
      tokenExpiration: null,
      isAuthenticated: false,
    });
  },

  updateTokens: (token: string, refreshToken: string, expiresIn: number) => {
    const expirationTime = Date.now() + expiresIn * 1000;
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('tokenExpiration', expirationTime.toString());
    set({
      token,
      refreshToken,
      tokenExpiration: expirationTime,
    });
  },

  initializeFromStorage: () => {
    const token = sessionStorage.getItem('authToken');
    const refreshToken = sessionStorage.getItem('refreshToken');
    const userStr = sessionStorage.getItem('adminUser');
    const expirationStr = sessionStorage.getItem('tokenExpiration');

    if (token && refreshToken && userStr && expirationStr) {
      try {
        const user = JSON.parse(userStr);
        const expiration = parseInt(expirationStr, 10);
        
        set({
          adminUser: user,
          token,
          refreshToken,
          tokenExpiration: expiration,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to parse auth data from storage:', error);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('adminUser');
        sessionStorage.removeItem('tokenExpiration');
      }
    }
  },
}));

export default useAuthStore;
