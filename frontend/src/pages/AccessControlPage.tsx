import React, { useEffect, useState } from 'react';
import { Shield, Users } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Topbar from '../components/layout/Topbar';
import { User } from '../types';
import { authService } from '../services/authService';
import { getInitials, getAvatarColor, formatDate } from '../utils';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AccessControlPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService.getUsers().then(setUsers).finally(() => setIsLoading(false));
  }, []);

  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return (
    <DashboardLayout>
      <Topbar title="Access Control" subtitle="Manage team members and roles" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="glass rounded-2xl overflow-hidden animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-subtle)]">
            <Shield size={16} style={{ color: 'var(--accent)' }} />
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">Team Members</span>
            <span className="ml-auto text-[11px] font-mono text-[var(--text-muted)]">{users.length} users</span>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton h-12 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-subtle)]">
              {users.map((u) => {
                const av = getAvatarColor(u.name);
                return (
                  <div key={u.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--surface-hover)] transition-colors">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                      style={{ background: av.bg, color: av.text, border: `1px solid ${av.text}33` }}
                    >
                      {getInitials(u.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[var(--text-primary)]">{u.name}</div>
                      <div className="text-[11px] text-[var(--text-secondary)]">{u.email}</div>
                    </div>
                    <span
                      className="text-[10px] font-semibold capitalize px-2.5 py-1 rounded-lg"
                      style={{
                        background: u.role === 'admin' ? 'var(--accent-dim)' : 'var(--purple-dim)',
                        color: u.role === 'admin' ? 'var(--accent)' : 'var(--purple)',
                      }}
                    >
                      {u.role}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccessControlPage;
