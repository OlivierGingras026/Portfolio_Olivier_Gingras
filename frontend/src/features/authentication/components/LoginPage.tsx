import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { authAPI } from '../api/authAPI';
import { getErrorMessage } from '../../../shared/api/errorHandler';

const FloatingShape = ({ delay, size }: { delay: number; size: string }) => {
  return (
    <motion.div
      className={`absolute ${size} rounded-full opacity-20`}
      style={{
        background: `linear-gradient(135deg, rgba(0, 217, 255, 0.5), rgba(176, 0, 255, 0.5))`,
        filter: 'blur(40px)',
      }}
      animate={{
        y: [0, 50, 0],
        x: [0, 30, 0],
      }}
      transition={{
        duration: 15 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState('admin@portfolio.com');
  const [password, setPassword] = useState('password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      setAuth(
        {
          adminId: response.adminId,
          email: response.email,
          fullName: response.fullName,
        },
        response.token
      );
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #030712 0%, #0a0e27 50%, #030712 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Animated Background Shapes - LOWER Z-INDEX */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 1 }}>
        <FloatingShape delay={0} size="w-72 h-72" />
        <FloatingShape delay={5} size="w-96 h-96" />
        <FloatingShape delay={10} size="w-64 h-64" />
      </div>

      {/* Login Card - HIGHER Z-INDEX */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 50, width: '100%', maxWidth: '28rem' }}
      >
        <div style={{
          backdropFilter: 'blur(12px)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginBottom: '32px' }}
          >
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #00d9ff, #b000ff, #ff006e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px',
            }}>
              Admin Access
            </h1>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
            }}>
              Manage your portfolio with secure authentication
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#00d9ff',
              }}>
                Email Address
              </label>
              <motion.input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="admin@portfolio.com"
                whileFocus={{ scale: 1.02 }}
                style={{
                  width: '100%',
                  backdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.8)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#00d9ff',
              }}>
                Password
              </label>
              <motion.input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="••••••••"
                whileFocus={{ scale: 1.02 }}
                style={{
                  width: '100%',
                  backdropFilter: 'blur(12px)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 217, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: 'white',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s',
                  opacity: isLoading ? 0.5 : 1,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.8)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  borderRadius: '8px',
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  fontSize: '14px',
                }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                width: '100%',
                backdropFilter: 'blur(12px)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontWeight: 'bold',
                color: 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                transition: 'all 0.3s',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.3)',
              }}
            >
              {isLoading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ⏳
                  </motion.span>
                  Authenticating...
                </>
              ) : (
                <>
                  🔐 Login
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '24px',
            }}
          >
            © 2026 Portfolio Olivier Gingras. All rights reserved.
          </motion.p>
        </div>

        {/* Animated Glow Effect */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '16px',
            zIndex: -1,
            background: 'transparent',
            backdropFilter: 'blur(12px)',
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(0, 217, 255, 0.3)',
              '0 0 40px rgba(176, 0, 255, 0.5)',
              '0 0 20px rgba(0, 217, 255, 0.3)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  );
}
