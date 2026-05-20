import React, { useState } from 'react';
import { Sun, Moon, User, Lock, Bell, Palette, Eye, EyeOff } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authService } from '../services/authService';
import { getErrorMessage } from '../utils';
import toast from 'react-hot-toast';

// ─── Password Section ─────────────────────────────────────────────────────────

interface PasswordForm {
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  newPassword?: string;
  confirmPassword?: string;
}

const SecuritySection: React.FC = () => {
  const [form, setForm] = useState<PasswordForm>({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<PasswordErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const set = (key: keyof PasswordForm, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: PasswordErrors = {};
    if (form.newPassword.length < 6) e.newPassword = 'Password must be at least 6 characters';
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await authService.updatePassword(form.newPassword);
      toast.success('Password updated successfully');
      setForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* New password */}
      <div>
        <label htmlFor="new-password" className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">
          New Password
        </label>
        <div className="relative">
          <input
            id="new-password"
            type={showNew ? 'text' : 'password'}
            className="input pr-10"
            placeholder="Min. 6 characters"
            value={form.newPassword}
            onChange={(e) => set('newPassword', e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowNew((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-[11px] text-[var(--red)] mt-1">{errors.newPassword}</p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="confirm-password" className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">
          Confirm Password
        </label>
        <input
          id="confirm-password"
          type="password"
          className="input"
          placeholder="Repeat new password"
          value={form.confirmPassword}
          onChange={(e) => set('confirmPassword', e.target.value)}
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p className="text-[11px] text-[var(--red)] mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-ghost text-[12px] px-4 py-2"
      >
        {isLoading ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

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
              <label htmlFor="display-name" className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">Display Name</label>
              <input id="display-name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">Email</label>
              <input id="profile-email" className="input" value={user?.email ?? ''} disabled />
            </div>
            <div>
              <label htmlFor="profile-role" className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">Role</label>
              <input id="profile-role" className="input capitalize" value={user?.role ?? ''} disabled />
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
            <button onClick={toggleTheme} className="btn btn-secondary text-[12px] gap-2 px-4 py-2">
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
          <SecuritySection />
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
