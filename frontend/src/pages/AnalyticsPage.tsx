import React from 'react';
import { TrendingUp, PieChart, BarChart2, Activity } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Topbar from '../components/layout/Topbar';
import StatCard from '../components/ui/StatCard';
import { useLeads } from '../hooks/useLeads';

const AnalyticsPage: React.FC = () => {
  const { stats, isStatsLoading } = useLeads();

  const total = stats?.total ?? 1;

  const sourceData = [
    { label: 'Website', value: Math.round(total * 0.45), color: '#3b82f6' },
    { label: 'Instagram', value: Math.round(total * 0.35), color: '#ec4899' },
    { label: 'Referral', value: Math.round(total * 0.20), color: 'var(--purple)' },
  ];

  const weeklyData = [
    { day: 'Mon', leads: 8 },
    { day: 'Tue', leads: 14 },
    { day: 'Wed', leads: 11 },
    { day: 'Thu', leads: 19 },
    { day: 'Fri', leads: 16 },
    { day: 'Sat', leads: 7 },
    { day: 'Sun', leads: 5 },
  ];
  const maxWeekly = Math.max(...weeklyData.map((d) => d.leads));

  return (
    <DashboardLayout>
      <Topbar title="Analytics" subtitle="Pipeline performance overview" />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          <StatCard label="Total Leads" value={stats?.total ?? 0} icon={<Activity size={16} />} accentColor="var(--accent)" isLoading={isStatsLoading} />
          <StatCard label="Qualified" value={stats?.qualified ?? 0} icon={<TrendingUp size={16} />} accentColor="var(--green)" isLoading={isStatsLoading} />
          <StatCard label="Contacted" value={stats?.contacted ?? 0} icon={<BarChart2 size={16} />} accentColor="var(--orange)" isLoading={isStatsLoading} />
          <StatCard label="Lost" value={stats?.lost ?? 0} icon={<PieChart size={16} />} accentColor="var(--red)" isLoading={isStatsLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly bar chart */}
          <div className="glass rounded-2xl p-5 animate-slide-up">
            <h3 className="text-[13px] font-bold text-[var(--text-primary)] mb-1">Weekly Lead Volume</h3>
            <p className="text-[11px] text-[var(--text-muted)] mb-5">New leads per day this week</p>
            <div className="flex items-end gap-2 h-36">
              {weeklyData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">{d.leads}</span>
                  <div className="w-full rounded-t-md transition-all duration-700 relative group" style={{ height: `${(d.leads / maxWeekly) * 100}%`, background: 'var(--accent-dim)', border: '1px solid var(--border-subtle)' }}>
                    <div className="absolute inset-0 rounded-t-md opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'var(--accent-glow)' }} />
                  </div>
                  <span className="text-[9px] font-mono text-[var(--text-muted)]">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source breakdown */}
          <div className="glass rounded-2xl p-5 animate-slide-up" style={{ animationDelay: '80ms' }}>
            <h3 className="text-[13px] font-bold text-[var(--text-primary)] mb-1">Lead Sources</h3>
            <p className="text-[11px] text-[var(--text-muted)] mb-5">Distribution by acquisition channel</p>
            <div className="space-y-4">
              {sourceData.map((s) => {
                const pct = Math.round((s.value / total) * 100);
                return (
                  <div key={s.label}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="text-[var(--text-secondary)] font-medium">{s.label}</span>
                      <span className="font-bold" style={{ color: s.color }}>{s.value} <span className="font-normal text-[var(--text-muted)] text-[11px]">({pct}%)</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status funnel */}
          <div className="glass rounded-2xl p-5 animate-slide-up lg:col-span-2" style={{ animationDelay: '160ms' }}>
            <h3 className="text-[13px] font-bold text-[var(--text-primary)] mb-1">Conversion Funnel</h3>
            <p className="text-[11px] text-[var(--text-muted)] mb-5">Lead progression through pipeline stages</p>
            <div className="flex items-center gap-3">
              {[
                { label: 'New', value: stats?.new ?? 0, color: 'var(--accent)' },
                { label: 'Contacted', value: stats?.contacted ?? 0, color: 'var(--orange)' },
                { label: 'Qualified', value: stats?.qualified ?? 0, color: 'var(--green)' },
                { label: 'Lost', value: stats?.lost ?? 0, color: 'var(--red)' },
              ].map((stage, i) => {
                const w = Math.round((stage.value / total) * 100);
                return (
                  <React.Fragment key={stage.label}>
                    <div className="flex-1 rounded-xl p-4 text-center" style={{ background: `${stage.color}12`, border: `1px solid ${stage.color}25` }}>
                      <div className="text-[22px] font-bold" style={{ color: stage.color }}>{stage.value}</div>
                      <div className="text-[10px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mt-0.5">{stage.label}</div>
                      <div className="text-[11px] mt-1" style={{ color: stage.color }}>{w}%</div>
                    </div>
                    {i < 3 && <div className="text-[var(--text-muted)] text-[18px] flex-shrink-0">›</div>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
