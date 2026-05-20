import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="app-bg" />
        <div className="relative z-10 flex flex-col items-center gap-4 animate-pulse">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', boxShadow: '0 0 30px var(--accent-dim)' }}
          >
            <Zap size={22} color="#fff" />
          </div>
          <p className="text-[12px] font-mono text-[var(--text-muted)] tracking-[2px] uppercase">Loading…</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
