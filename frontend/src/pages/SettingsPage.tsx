import React, { useState } from 'react';
import { Sun, Moon, User, Lock, Bell, Palette } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name ?? '');
  const [notifications, setNotifications] = useState(true);

  return (
    <DashboardLayout>
      <Topbar title="Settings" subtitle="Manage your preferences" />
      <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-2xl">

        {/* Profile */}
        <Section icon={<User size={15} />} title="Profile">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">Display Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">Email</label>
              <input className="input" value={user?.email ?? ''} disabled />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">Role</label>
              <input className="input capitalize" value={user?.role ?? ''} disabled />
            </div>
            <button
              className="btn btn-primary text-[12px] px-4 py-2"
              onClick={() => toast.success('Profile updated')}
            >
              Save Changes
            </button>
          </div>
        </Section>

        {/* Appearance */}
        <Section icon={<Palette size={15} />} title="Appearance">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">Color Theme</div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Currently using <span className="text-[var(--accent)]">{theme} mode</span>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="btn btn-secondary text-[12px] gap-2 px-4 py-2"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              Switch to {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </Section>

        {/* Notifications */}
        <Section icon={<Bell size={15} />} title="Notifications">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-[13px] font-medium text-[var(--text-primary)]">Lead Alerts</div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Get notified when new leads are added</div>
            </div>
            <button
              onClick={() => setNotifications((n) => !n)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${notifications ? 'bg-[var(--accent)]' : 'bg-[var(--border-subtle)]'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${notifications ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
        </Section>

        {/* Security */}
        <Section icon={<Lock size={15} />} title="Security">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">New Password</label>
              <input type="password" className="input" placeholder="Min. 6 characters" />
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">Confirm Password</label>
              <input type="password" className="input" placeholder="Repeat password" />
            </div>
            <button
              className="btn btn-ghost text-[12px] px-4 py-2"
              onClick={() => toast.success('Password updated')}
            >
              Update Password
            </button>
          </div>
        </Section>

      </div>
    </DashboardLayout>
  );
};

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="glass rounded-2xl overflow-hidden animate-slide-up">
    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[var(--border-subtle)]">
      <span style={{ color: 'var(--accent)' }}>{icon}</span>
      <span className="text-[13px] font-bold text-[var(--text-primary)]">{title}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export default SettingsPage;
