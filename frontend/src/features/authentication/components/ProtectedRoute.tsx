import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, tokenExpiration, initializeFromStorage, updateTokens } = useAuthStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Initialize auth state from storage
    initializeFromStorage();
  }, [initializeFromStorage]);

  // Auto-refresh token if expired but refresh token exists
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const token = sessionStorage.getItem('authToken');
      const refreshToken = sessionStorage.getItem('refreshToken');
      const expirationStr = sessionStorage.getItem('tokenExpiration');

      if (!token || !refreshToken || !expirationStr) return;

      const expiration = parseInt(expirationStr, 10);
      const now = Date.now();

      // If token is expired, refresh it
      if (now > expiration) {
        setIsRefreshing(true);
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
          const response = await fetch(`${backendUrl}/api/admin/auth/refresh`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${refreshToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`Refresh failed with status ${response.status}`);
          }

          const data = await response.json();
          const { token: newToken, refreshToken: newRefreshToken, expiresIn } = data;
          
          updateTokens(newToken, newRefreshToken, expiresIn);
          setIsRefreshing(false);
        } catch (error) {
          console.error('Token refresh failed:', error);
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('adminUser');
          sessionStorage.removeItem('tokenExpiration');
          setIsRefreshing(false);
          navigate('/admin/login', { replace: true });
        }
      }
    };

    checkAndRefreshToken();
  }, [navigate, tokenExpiration, updateTokens]);

  // Check authentication after initialization
  useEffect(() => {
    if (!isRefreshing && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate, isRefreshing]);

  // Show nothing while not authenticated or refreshing
  if (!isAuthenticated || isRefreshing) {
    return null;
  }

  return <>{children}</>;
}
