import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, token, initializeFromStorage } = useAuthStore();

  useEffect(() => {
    initializeFromStorage();

    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [token, navigate, initializeFromStorage]);

  if (!isAuthenticated || !token) {
    return null;
  }

  return <>{children}</>;
}
