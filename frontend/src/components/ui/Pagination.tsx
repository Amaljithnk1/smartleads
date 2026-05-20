import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { page, totalPages, total, limit, hasNextPage, hasPrevPage } = meta;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const renderPages = () => {
    const result: React.ReactNode[] = [];
    let prev = 0;
    for (const p of pages) {
      if (p - prev > 1) {
        result.push(
          <span key={`ellipsis-${p}`} className="px-1 text-[var(--text-muted)] text-[12px]">…</span>
        );
      }
      result.push(
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-7 h-7 rounded-lg text-[12px] font-medium transition-all border
            ${p === page
              ? 'border-[var(--border)] bg-[var(--accent-dim)] text-[var(--accent)]'
              : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border)] hover:text-[var(--text-primary)]'
            }`}
        >
          {p}
        </button>
      );
      prev = p;
    }
    return result;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-subtle)]">
      <span className="text-[11px] font-mono text-[var(--text-muted)]">
        {total === 0 ? 'No results' : `${start}–${end} of ${total} leads`}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          className="w-7 h-7 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] flex items-center justify-center hover:border-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={14} />
        </button>

        {renderPages()}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          className="w-7 h-7 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] flex items-center justify-center hover:border-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
