import { useContext } from 'react';
import PortfolioContext, { type PortfolioContextType } from './PortfolioContext';

export const usePortfolioData = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within PortfolioProvider');
  }
  return context;
};
