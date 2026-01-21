import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/authentication/components/LoginPage';
import { ProtectedRoute } from './features/authentication/components/ProtectedRoute';
import { PortfolioHome } from './features/portfolio/pages/PortfolioHome';
import { AdminDashboard } from './features/admin/pages/AdminDashboard';
import useAuthStore from './features/authentication/store/authStore';
import './index.css';

function App() {
  const initializeFromStorage = useAuthStore((state) => state.initializeFromStorage);

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        
        <Route path="/admin/login" element={<LoginPage />} />
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
