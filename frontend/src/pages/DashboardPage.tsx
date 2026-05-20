import React from 'react';
import { Users, Star, Mail, XCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Topbar from '../components/layout/Topbar';
import StatCard from '../components/ui/StatCard';
import { useLeads } from '../hooks/useLeads';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { stats, isStatsLoading } = useLeads();
  const { user } = useAuth();

  const conversionRate = stats
    ? Math.round((stats.qualified / Math.max(stats.total, 1)) * 100)
    : 0;

  return (
    <DashboardLayout>
      <Topbar
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name ?? 'User'} · ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
          <StatCard
            label="Total Leads"
            value={stats?.total ?? 0}
            delta="All time"
            deltaType="neutral"
            icon={<Users size={16} />}
            accentColor="var(--accent)"
            isLoading={isStatsLoading}
          />
          <StatCard
            label="Qualified"
            value={stats?.qualified ?? 0}
            delta={`${conversionRate}% conversion`}
            deltaType="up"
            icon={<Star size={16} />}
            accentColor="var(--green)"
            isLoading={isStatsLoading}
          />
          <StatCard
            label="Contacted"
            value={stats?.contacted ?? 0}
            delta="In progress"
            deltaType="neutral"
            icon={<Mail size={16} />}
            accentColor="var(--orange)"
            isLoading={isStatsLoading}
          />
          <StatCard
            label="Lost"
            value={stats?.lost ?? 0}
            delta={`${stats ? Math.round((stats.lost / Math.max(stats.total, 1)) * 100) : 0}% churn`}
            deltaType="down"
            icon={<XCircle size={16} />}
            accentColor="var(--red)"
            isLoading={isStatsLoading}
          />
        </div>

        {/* Summary card */}
        <div className="glass rounded-2xl p-6 max-w-lg animate-slide-up">
          <h3 className="text-[13px] font-bold text-[var(--text-primary)] mb-4">Pipeline Summary</h3>
          {(['new', 'contacted', 'qualified', 'lost'] as const).map((key) => {
            const val = stats?.[key] ?? 0;
            const total = stats?.total ?? 1;
            const pct = Math.round((val / total) * 100);
            const colors = { new: 'var(--accent)', contacted: 'var(--orange)', qualified: 'var(--green)', lost: 'var(--red)' };
            return (
              <div key={key} className="mb-3 last:mb-0">
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-mono uppercase tracking-[1px] text-[var(--text-muted)] capitalize">{key}</span>
                  <span style={{ color: colors[key] }} className="font-semibold">{val} ({pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: colors[key] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
