import React from 'react';
import { X, Mail, Tag, Antenna, Calendar, User } from 'lucide-react';
import { Lead } from '../../types';
import { formatDate, getInitials, getAvatarColor, getStatusBadgeClass, getSourceBadgeClass } from '../../utils';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onEdit: () => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onEdit }) => {
  if (!lead) return null;
  const av = getAvatarColor(lead.name);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-2 rounded-2xl w-full max-w-md animate-slide-up border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-[15px] font-bold text-[var(--text-primary)]">Lead Details</h2>
          <button onClick={onClose} className="btn btn-ghost w-8 h-8 p-0 rounded-lg">
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-[18px] font-bold"
              style={{ background: av.bg, color: av.text, border: `1px solid ${av.text}33` }}
            >
              {getInitials(lead.name)}
            </div>
            <div>
              <div className="text-[18px] font-bold text-[var(--text-primary)]">{lead.name}</div>
              <div className="text-[13px] text-[var(--text-secondary)] mt-0.5">{lead.email}</div>
            </div>
          </div>

          {/* Details grid */}
          <div className="space-y-3">
            <Detail icon={<Tag size={13} />} label="Status">
              <span className={getStatusBadgeClass(lead.status)}>{lead.status}</span>
            </Detail>
            <Detail icon={<Antenna size={13} />} label="Source">
              <span className={getSourceBadgeClass(lead.source)}>{lead.source}</span>
            </Detail>
            <Detail icon={<Calendar size={13} />} label="Created">
              <span className="text-[13px] text-[var(--text-primary)] font-mono">{formatDate(lead.createdAt)}</span>
            </Detail>
            {typeof lead.createdBy === 'object' && (
              <Detail icon={<User size={13} />} label="Created By">
                <span className="text-[13px] text-[var(--text-primary)]">{lead.createdBy.name}</span>
              </Detail>
            )}
            {lead.notes && (
              <div className="pt-2">
                <div className="text-[10px] font-mono uppercase tracking-[1.5px] text-[var(--text-muted)] mb-1.5">Notes</div>
                <p className="text-[13px] text-[var(--text-secondary)] glass rounded-xl p-3 leading-relaxed">{lead.notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="btn btn-ghost flex-1">Close</button>
            <button onClick={onEdit} className="btn btn-primary flex-1">Edit Lead</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail: React.FC<{ icon: React.ReactNode; label: string; children: React.ReactNode }> = ({ icon, label, children }) => (
  <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
    <div className="flex items-center gap-2 text-[var(--text-muted)]">
      {icon}
      <span className="text-[11px] font-mono uppercase tracking-[1px]">{label}</span>
    </div>
    {children}
  </div>
);

export default LeadDetailModal;
