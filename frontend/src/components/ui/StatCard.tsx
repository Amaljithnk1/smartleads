import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  delta?: string;
  deltaType?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  accentColor: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label, value, delta, deltaType = 'neutral', icon, accentColor, isLoading,
}) => {
  const deltaColor =
    deltaType === 'up' ? 'var(--green)' :
    deltaType === 'down' ? 'var(--red)' :
    'var(--text-muted)';

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-4 relative overflow-hidden animate-pulse">
        <div className="skeleton h-3 w-20 mb-3 rounded" />
        <div className="skeleton h-8 w-16 mb-2 rounded" />
        <div className="skeleton h-2 w-24 rounded" />
      </div>
    );
  }

  return (
    <div
      className="glass rounded-2xl p-4 relative overflow-hidden cursor-default group transition-all duration-200 hover:-translate-y-0.5"
      style={{ borderColor: `${accentColor}20` }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
      />

      <div className="flex items-start justify-between mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accentColor}18`, color: accentColor }}
        >
          {icon}
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[1.5px] text-[var(--text-muted)]">
          {label}
        </span>
      </div>

      <div className="text-[28px] font-bold leading-none mb-1.5" style={{ color: accentColor }}>
        {value}
      </div>

      {delta && (
        <div className="text-[11px] font-medium" style={{ color: deltaColor }}>
          {delta}
        </div>
      )}

      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
        style={{ boxShadow: `inset 0 0 30px ${accentColor}08` }}
      />
    </div>
  );
};

export default StatCard;
