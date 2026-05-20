import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Lead, LeadFormData, LeadStatus, LeadSource } from '../../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<boolean>;
  lead?: Lead | null;
  isLoading?: boolean;
}

const INITIAL: LeadFormData = {
  name: '', email: '', status: 'New', source: 'Website', notes: '',
};

const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSubmit, lead, isLoading }) => {
  const [form, setForm] = useState<LeadFormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<LeadFormData>>({});

  useEffect(() => {
    if (lead) {
      setForm({ name: lead.name, email: lead.email, status: lead.status, source: lead.source, notes: lead.notes ?? '' });
    } else {
      setForm(INITIAL);
    }
    setErrors({});
  }, [lead, isOpen]);

  const validate = (): boolean => {
    const e: Partial<LeadFormData> = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (!form.source) e.source = 'Source is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = await onSubmit(form);
    if (ok) onClose();
  };

  const set = (key: keyof LeadFormData, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="glass-2 rounded-2xl w-full max-w-md animate-slide-up border border-[var(--border-subtle)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
          <h2 className="text-[16px] font-bold text-[var(--text-primary)]">
            {lead ? 'Edit Lead' : 'New Lead'}
          </h2>
          <button onClick={onClose} className="btn btn-ghost w-8 h-8 p-0 rounded-lg">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">
              Full Name *
            </label>
            <input className="input" placeholder="e.g. Rahul Sharma" value={form.name} onChange={(e) => set('name', e.target.value)} />
            {errors.name && <p className="text-[11px] text-[var(--red)] mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">
              Email Address *
            </label>
            <input type="email" className="input" placeholder="e.g. rahul@company.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
            {errors.email && <p className="text-[11px] text-[var(--red)] mt-1">{errors.email}</p>}
          </div>

          {/* Status + Source */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">
                Status
              </label>
              <select className="input" value={form.status} onChange={(e) => set('status', e.target.value as LeadStatus)}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">
                Source *
              </label>
              <select className="input" value={form.source} onChange={(e) => set('source', e.target.value as LeadSource)}>
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
              {errors.source && <p className="text-[11px] text-[var(--red)] mt-1">{errors.source}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-[1px] text-[var(--text-muted)] mb-1.5">
              Notes <span className="normal-case text-[var(--text-muted)]">(optional)</span>
            </label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Any additional context…"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary flex-1">
              {isLoading ? 'Saving…' : lead ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
