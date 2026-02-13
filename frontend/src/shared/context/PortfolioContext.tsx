import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { portfolioAPI, type PortfolioData } from '../api/portfolioAPI';

interface PortfolioContextType {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const portfolioData = await portfolioAPI.getAllPortfolioData();
        setData(portfolioData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const portfolioData = await portfolioAPI.getAllPortfolioData();
      setData(portfolioData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for cache invalidation events from admin dashboard
  useEffect(() => {
    const unsubscribe = portfolioAPI.onCacheInvalidated(() => {
      // Refetch data when cache is invalidated by admin operations
      refetch().catch(console.error);
    });

    return unsubscribe;
  }, [refetch]);

  return (
    <PortfolioContext.Provider value={{ data, loading, error, refetch }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioContext;
export type { PortfolioContextType };

