import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Topbar from '../components/layout/Topbar';
import FiltersBar from '../components/leads/FiltersBar';
import LeadTable from '../components/leads/LeadTable';
import LeadModal from '../components/leads/LeadModal';
import ConfirmDeleteModal from '../components/leads/ConfirmDeleteModal';
import LeadDetailModal from '../components/leads/LeadDetailModal';
import Pagination from '../components/ui/Pagination';
import { useLeads } from '../hooks/useLeads';
import { Lead, LeadFormData } from '../types';

const LeadsPage: React.FC = () => {
  const {
    leads, meta, filters, isLoading, isMutating,
    updateFilter, resetFilters,
    createLead, updateLead, deleteLead, exportCSV,
  } = useLeads();

  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleNewLead = () => { setEditingLead(null); setShowModal(true); };
  const handleEditLead = (lead: Lead) => { setEditingLead(lead); setShowModal(true); };
  const handleViewLead = (lead: Lead) => setViewingLead(lead);

  const handleSubmit = async (data: LeadFormData): Promise<boolean> => {
    if (editingLead) return updateLead(editingLead._id, data);
    return createLead(data);
  };

  const handleDelete = async () => {
    if (!deletingLead) return;
    const ok = await deleteLead(deletingLead._id);
    if (ok) setDeletingLead(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportCSV();
    setIsExporting(false);
  };

  return (
    <DashboardLayout>
      <Topbar
        title="Leads"
        subtitle={meta ? `${meta.total} total leads` : 'Manage your pipeline'}
        onNewLead={handleNewLead}
        onExportCSV={handleExport}
        isExporting={isExporting}
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="mb-4 animate-fade-in">
          <FiltersBar filters={filters} onFilterChange={updateFilter} onReset={resetFilters} />
        </div>

        {/* Table */}
        <div className="glass rounded-2xl overflow-hidden animate-slide-up">
          <LeadTable
            leads={leads}
            isLoading={isLoading}
            onEdit={handleEditLead}
            onDelete={setDeletingLead}
            onView={handleViewLead}
          />
          {meta && meta.totalPages > 1 && (
            <Pagination meta={meta} onPageChange={(p) => updateFilter('page', p)} />
          )}
        </div>
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        lead={editingLead}
        isLoading={isMutating}
      />

      <ConfirmDeleteModal
        lead={deletingLead}
        onConfirm={handleDelete}
        onClose={() => setDeletingLead(null)}
        isLoading={isMutating}
      />

      <LeadDetailModal
        lead={viewingLead}
        onClose={() => setViewingLead(null)}
        onEdit={() => { if (viewingLead) { handleEditLead(viewingLead); setViewingLead(null); } }}
      />
    </DashboardLayout>
  );
};

export default LeadsPage;
