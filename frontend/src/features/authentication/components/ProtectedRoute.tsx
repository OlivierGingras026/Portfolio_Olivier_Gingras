import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthenticated, initializeFromStorage } = useAuthStore();

  useEffect(() => {
    // Initialize auth state from storage
    initializeFromStorage();
  }, [initializeFromStorage]);

  useEffect(() => {
    // Check authentication after state updates from storage
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show nothing while not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
