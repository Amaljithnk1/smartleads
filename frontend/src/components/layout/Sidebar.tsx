import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart2, FileText,
  ShieldCheck, Settings, LogOut, Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials, getAvatarColor } from '../../utils';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard' },
  { to: '/leads', icon: <Users size={16} />, label: 'Leads' },
  { to: '/analytics', icon: <BarChart2 size={16} />, label: 'Analytics' },
  { to: '/reports', icon: <FileText size={16} />, label: 'Reports' },
];

const SYSTEM_ITEMS: NavItem[] = [
  { to: '/access', icon: <ShieldCheck size={16} />, label: 'Access Control', adminOnly: true },
  { to: '/settings', icon: <Settings size={16} />, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const avatarColor = getAvatarColor(user?.name ?? 'U');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 border
    ${isActive
      ? 'border-[var(--border)] bg-[var(--accent-dim)] text-[var(--accent)]'
      : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
    }`;

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col glass-2 border-r border-[var(--border-subtle)] z-10">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-[18px] border-b border-[var(--border-subtle)]">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            boxShadow: '0 0 16px var(--accent-dim)',
          }}
        >
          <Zap size={15} color="#fff" />
        </div>
        <div>
          <div className="text-[14px] font-bold text-[var(--text-primary)] leading-tight">SmartLeads</div>
          <div className="text-[9px] font-mono tracking-[2px] uppercase text-[var(--text-muted)]">CRM Dashboard</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="text-[9px] font-mono uppercase tracking-[2px] text-[var(--text-muted)] px-2 mb-2">
          Main
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={navLinkClass}>
            <span className="text-current">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto text-[9px] font-bold bg-[var(--accent)] text-black px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="text-[9px] font-mono uppercase tracking-[2px] text-[var(--text-muted)] px-2 mb-2 mt-4">
          System
        </div>
        {SYSTEM_ITEMS.filter((i) => !i.adminOnly || user?.role === 'admin').map((item) => (
          <NavLink key={item.to} to={item.to} className={navLinkClass}>
            <span className="text-current">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--accent-glow)] group">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{ background: avatarColor.bg, color: avatarColor.text, border: `1px solid ${avatarColor.text}33` }}
          >
            {getInitials(user?.name ?? 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{user?.name}</div>
            <div
              className="text-[10px] px-1.5 py-0.5 rounded inline-block mt-0.5 font-medium capitalize"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
            >
              {user?.role}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[var(--red-dim)] hover:text-[var(--red)] text-[var(--text-muted)]"
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
