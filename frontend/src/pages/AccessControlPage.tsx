import React, { useEffect, useState, useCallback } from 'react';
import { Shield, UserCheck, UserX } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Topbar from '../components/layout/Topbar';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { getInitials, getAvatarColor, getErrorMessage } from '../utils';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// ─── Sub-components ──────────────────────────────────────────────────────────

const SkeletonRows: React.FC = () => (
  <div className="p-6 space-y-3">
    <div className="skeleton h-14 rounded-xl" />
    <div className="skeleton h-14 rounded-xl" />
    <div className="skeleton h-14 rounded-xl" />
  </div>
);

interface RoleButtonProps {
  userId: string;
  currentRole: UserRole;
  isUpdating: boolean;
  onRoleChange: (userId: string, role: UserRole) => void;
}

const RoleButton: React.FC<RoleButtonProps> = ({ userId, currentRole, isUpdating, onRoleChange }) => {
  const isPromote = currentRole !== 'admin';
  const label = isPromote ? 'Promote' : 'Demote';
  const targetRole: UserRole = isPromote ? 'admin' : 'sales';

  return (
    <button
      onClick={() => onRoleChange(userId, targetRole)}
      disabled={isUpdating}
      className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all flex-shrink-0"
      style={{
        background: isPromote ? 'var(--accent-dim)' : 'rgba(255,68,102,0.1)',
        color: isPromote ? 'var(--accent)' : 'var(--red)',
        opacity: isUpdating ? 0.5 : 1,
      }}
      title={isPromote ? 'Promote to Admin' : 'Demote to Sales'}
    >
      {isUpdating && <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />}
      {!isUpdating && isPromote && <UserCheck size={12} />}
      {!isUpdating && !isPromote && <UserX size={12} />}
      {label}
    </button>
  );
};

interface UserRowProps {
  u: User;
  isSelf: boolean;
  isUpdating: boolean;
  onRoleChange: (userId: string, role: UserRole) => void;
}

const UserRow: React.FC<UserRowProps> = ({ u, isSelf, isUpdating, onRoleChange }) => {
  const av = getAvatarColor(u.name);

  return (
    <div className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--surface-hover)] transition-colors">
      {/* Avatar */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
        style={{ background: av.bg, color: av.text, border: `1px solid ${av.text}33` }}
      >
        {getInitials(u.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{u.name}</span>
          {isSelf && (
            <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-2)] px-1.5 py-0.5 rounded">
              you
            </span>
          )}
        </div>
        <div className="text-[11px] text-[var(--text-secondary)] truncate">{u.email}</div>
      </div>

      {/* Role badge */}
      <span
        className="text-[10px] font-semibold capitalize px-2.5 py-1 rounded-lg flex-shrink-0"
        style={{
          background: u.role === 'admin' ? 'var(--accent-dim)' : 'var(--purple-dim)',
          color: u.role === 'admin' ? 'var(--accent)' : 'var(--purple)',
        }}
      >
        {u.role}
      </span>

      {/* Action — hidden for self */}
      {!isSelf && (
        <RoleButton
          userId={u.id}
          currentRole={u.role}
          isUpdating={isUpdating}
          onRoleChange={onRoleChange}
        />
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const AccessControlPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    authService.getUsers()
      .then(setUsers)
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  if (currentUser?.role !== 'admin') return <Navigate to="/dashboard" replace />;

  const handleRoleChange = async (userId: string, newRole: UserRole): Promise<void> => {
    setUpdatingId(userId);
    try {
      const updated = await authService.updateRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: updated.role } : u)));
      toast.success(`User ${newRole === 'admin' ? 'promoted to Admin' : 'changed to Sales'}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) return <SkeletonRows />;
    if (users.length === 0) {
      return <div className="p-10 text-center text-[13px] text-[var(--text-muted)]">No users found.</div>;
    }
    return (
      <div className="divide-y divide-[var(--border-subtle)]">
        {users.map((u) => (
          <UserRow
            key={u.id}
            u={u}
            isSelf={u.id === currentUser?.id || u.email === currentUser?.email}
            isUpdating={updatingId === u.id}
            onRoleChange={handleRoleChange}
          />
        ))}
      </div>
    );
  };

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
          {renderContent()}
        </div>

        <p className="text-[11px] text-[var(--text-muted)] mt-4 px-1">
          New users register as <span className="text-[var(--accent)]">Sales</span> by default.
          Promote them to <span className="text-[var(--accent)]">Admin</span> here to grant full access.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default AccessControlPage;
