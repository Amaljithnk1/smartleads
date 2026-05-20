import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Topbar from '../components/layout/Topbar';
import LeadTable from '../components/leads/LeadTable';
import FiltersBar from '../components/leads/FiltersBar';
import Pagination from '../components/ui/Pagination';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import LeadModal from '../components/leads/LeadModal';
import { useLeads } from '../hooks/useLeads';
import { Lead, LeadFormData } from '../types';
import toast from 'react-hot-toast';

const ReportsPage: React.FC = () => {
  const {
    leads, meta, filters, isLoading, isMutating,
    updateFilter, resetFilters, updateLead, exportCSV,
  } = useLeads();

  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    await exportCSV();
    setIsExporting(false);
  };

  const handleUpdate = async (data: LeadFormData): Promise<boolean> => {
    if (!editingLead) return false;
    return updateLead(editingLead._id, data);
  };

  return (
    <DashboardLayout>
      <Topbar
        title="Reports"
        subtitle="Export and review your full lead pipeline"
        onExportCSV={handleExport}
        isExporting={isExporting}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Report summary */}
        <div className="glass rounded-2xl p-5 flex items-center gap-6 animate-fade-in">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            <FileText size={18} />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold text-[var(--text-primary)]">Full Pipeline Report</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {meta?.total ?? 0} total leads · Use filters below to narrow scope before exporting
            </div>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn btn-primary text-[12px] gap-2 px-4 py-2"
          >
            <Download size={14} />
            {isExporting ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>

        {/* Filters */}
        <div className="animate-fade-in" style={{ animationDelay: '60ms' }}>
          <FiltersBar filters={filters} onFilterChange={updateFilter} onReset={resetFilters} />
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden animate-slide-up" style={{ animationDelay: '120ms' }}>
          <LeadTable
            leads={leads}
            isLoading={isLoading}
            onEdit={(lead) => setEditingLead(lead)}
            onDelete={() => toast.error('Delete is only available from the Leads page (Admin only)')}
            onView={setViewingLead}
          />
          {meta && meta.totalPages > 1 && (
            <Pagination meta={meta} onPageChange={(p) => updateFilter('page', p)} />
          )}
        </div>
      </div>

      <LeadDetailModal
        lead={viewingLead}
        onClose={() => setViewingLead(null)}
        onEdit={() => { if (viewingLead) { setEditingLead(viewingLead); setViewingLead(null); } }}
      />
      <LeadModal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdate}
        lead={editingLead}
        isLoading={isMutating}
      />
    </DashboardLayout>
  );
};

export default ReportsPage;
