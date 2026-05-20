import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Lead } from '../../types';

interface ConfirmDeleteProps {
  lead: Lead | null;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteProps> = ({ lead, onConfirm, onClose, isLoading }) => {
  if (!lead) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-2 rounded-2xl w-full max-w-sm animate-slide-up border border-[var(--red-dim)] p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--red-dim)] text-[var(--red)] flex-shrink-0 mt-0.5">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-1">Delete Lead</h3>
            <p className="text-[13px] text-[var(--text-secondary)]">
              Are you sure you want to delete <span className="font-semibold text-[var(--text-primary)]">{lead.name}</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-ghost flex-1">Cancel</button>
          <button onClick={onConfirm} disabled={isLoading} className="btn btn-danger flex-1">
            {isLoading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
