import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (!form.password) e.password = 'Password required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="app-bg" />
      <div className="grid-floor" />
      <div className="scan-line" />

      <div className="relative z-10 w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              boxShadow: '0 0 30px var(--accent-dim)',
            }}
          >
            <Zap size={22} color="#fff" />
          </div>
          <h1 className="text-[24px] font-bold text-[var(--text-primary)]">SmartLeads</h1>
          <p className="text-[12px] font-mono text-[var(--text-muted)] tracking-[2px] uppercase mt-1">CRM Dashboard</p>
        </div>

        {/* Card */}
        <div className="glass-2 rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-[18px] font-bold text-[var(--text-primary)]">Sign In</h2>
            <p className="text-[12px] text-[var(--text-secondary)] mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                autoComplete="email"
              />
              {errors.email && <p className="text-[11px] text-[var(--red)] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-[var(--red)] mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-full mt-2">
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="px-6 pb-6 text-center">
            <p className="text-[12px] text-[var(--text-secondary)]">
              No account?{' '}
              <Link to="/register" className="text-[var(--accent)] hover:underline font-semibold">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
