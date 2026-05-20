import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Lead } from '../../types';
import { formatDate, getInitials, getAvatarColor, getStatusBadgeClass, getSourceBadgeClass } from '../../utils';
import { useAuth } from '../../context/AuthContext';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

const SkeletonRow: React.FC = () => (
  <tr>
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
      </td>
    ))}
  </tr>
);

const LeadTable: React.FC<LeadTableProps> = ({ leads, isLoading, onEdit, onDelete, onView }) => {
  const { user } = useAuth();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-[var(--border-subtle)]">
            {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-[10px] font-mono uppercase tracking-[1.5px] text-[var(--text-muted)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            : leads.map((lead, idx) => {
                const av = getAvatarColor(lead.name);
                return (
                  <tr
                    key={lead._id}
                    className="table-row-hover border-b border-[var(--border-subtle)] last:border-0 animate-fade-in"
                    style={{ animationDelay: `${idx * 30}ms` }}
                    onClick={() => onView(lead)}
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{ background: av.bg, color: av.text, border: `1px solid ${av.text}33` }}
                        >
                          {getInitials(lead.name)}
                        </div>
                        <span className="text-[13px] font-semibold text-[var(--text-primary)] truncate max-w-[140px]">
                          {lead.name}
                        </span>
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-4 py-3">
                      <span className="text-[12px] text-[var(--text-secondary)] truncate max-w-[160px] block">
                        {lead.email}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={getStatusBadgeClass(lead.status)}>{lead.status}</span>
                    </td>
                    {/* Source */}
                    <td className="px-4 py-3">
                      <span className={getSourceBadgeClass(lead.source)}>{lead.source}</span>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-mono text-[var(--text-muted)]">
                        {formatDate(lead.createdAt)}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEdit(lead)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-all"
                          title="Edit lead"
                        >
                          <Edit2 size={13} />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => onDelete(lead)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--red)] hover:text-[var(--red)] hover:bg-[var(--red-dim)] transition-all"
                            title="Delete lead"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>

      {!isLoading && leads.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="text-4xl opacity-20">◎</div>
          <p className="text-[var(--text-secondary)] text-[14px]">No leads found</p>
          <p className="text-[var(--text-muted)] text-[12px]">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default LeadTable;
