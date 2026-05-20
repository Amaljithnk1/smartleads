import React from 'react';
import { Search, X } from 'lucide-react';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '../../types';

interface FiltersBarProps {
  filters: LeadFilters;
  onFilterChange: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  onReset: () => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ filters, onFilterChange, onReset }) => {
  const hasActiveFilters = filters.search || filters.status || filters.source || filters.sort !== 'latest';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
        <input
          type="text"
          className="input pl-9 py-[9px]"
          placeholder="Search by name or email…"
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange('search', '')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Status */}
      <select
        className="input py-[9px] w-auto min-w-[130px] cursor-pointer"
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value as LeadStatus | '')}
      >
        <option value="">All Status</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Lost">Lost</option>
      </select>

      {/* Source */}
      <select
        className="input py-[9px] w-auto min-w-[130px] cursor-pointer"
        value={filters.source}
        onChange={(e) => onFilterChange('source', e.target.value as LeadSource | '')}
      >
        <option value="">All Sources</option>
        <option value="Website">Website</option>
        <option value="Instagram">Instagram</option>
        <option value="Referral">Referral</option>
      </select>

      {/* Sort */}
      <select
        className="input py-[9px] w-auto min-w-[120px] cursor-pointer"
        value={filters.sort}
        onChange={(e) => onFilterChange('sort', e.target.value as SortOrder)}
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <button onClick={onReset} className="btn btn-ghost text-[12px] gap-1.5 px-3 py-[9px]">
          <X size={13} /> Reset
        </button>
      )}
    </div>
  );
};

export default FiltersBar;
