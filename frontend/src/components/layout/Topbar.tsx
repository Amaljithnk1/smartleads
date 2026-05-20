import React from 'react';
import { Sun, Moon, Download, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onNewLead?: () => void;
  onExportCSV?: () => void;
  isExporting?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ title, subtitle, onNewLead, onExportCSV, isExporting }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center gap-3 px-6 py-4 glass-2 border-b border-[var(--border-subtle)] flex-shrink-0 z-10">
      <div>
        <h1 className="text-[17px] font-bold text-[var(--text-primary)] leading-tight">{title}</h1>
        {subtitle && <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">{subtitle}</p>}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="btn btn-ghost text-[12px] gap-2 px-3 py-2"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>

        {onExportCSV && (
          <button onClick={onExportCSV} disabled={isExporting} className="btn btn-ghost text-[12px] gap-2 px-3 py-2">
            <Download size={14} />
            <span className="hidden sm:inline">{isExporting ? 'Exporting…' : 'Export CSV'}</span>
          </button>
        )}

        {onNewLead && (
          <button onClick={onNewLead} className="btn btn-primary text-[12px] gap-2 px-3 py-2">
            <Plus size={14} />
            New Lead
          </button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
