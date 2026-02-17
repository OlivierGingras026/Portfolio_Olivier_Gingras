import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export function useTokenRefresh() {
  const { updateTokens } = useAuthStore();

  useEffect(() => {
    let timeoutId: number | null = null;

    const scheduleRefresh = () => {
      const expirationStr = sessionStorage.getItem('tokenExpiration');
      const refreshToken = sessionStorage.getItem('refreshToken');

      if (!expirationStr || !refreshToken) return;

      const expiration = parseInt(expirationStr, 10);
      const now = Date.now();
      const timeUntilExpiry = expiration - now;

      // Refresh 1 minute BEFORE token expires (proactive)
      const refreshTime = timeUntilExpiry - 60 * 1000;

      if (refreshTime > 0) {
        // Schedule refresh for 1 minute before expiration
        timeoutId = setTimeout(async () => {
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
            console.log('✅ Token refreshed (proactive)');

            // Schedule next refresh
            scheduleRefresh();
          } catch (error) {
            console.error('Token refresh failed:', error);
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('adminUser');
            sessionStorage.removeItem('tokenExpiration');
          }
        }, refreshTime);
      }
    };

    scheduleRefresh();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [updateTokens]);
}
