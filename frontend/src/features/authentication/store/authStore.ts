import { create } from 'zustand';
import type { AdminUser } from '../types/auth';

interface AuthStore {
  adminUser: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AdminUser, token: string) => void;
  logout: () => void;
  initializeFromStorage: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  adminUser: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user: AdminUser, token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    set({
      adminUser: user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
    set({
      adminUser: null,
      token: null,
      isAuthenticated: false,
    });
  },

  initializeFromStorage: () => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('adminUser');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          adminUser: user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to parse admin user from storage:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminUser');
      }
    }
  },
}));

export default useAuthStore;
