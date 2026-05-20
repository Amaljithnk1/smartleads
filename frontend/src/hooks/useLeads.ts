import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadFilters, LeadStats, PaginationMeta, LeadFormData } from '../types';
import { leadService } from '../services/leadService';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
  limit: 10,
};

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const { leads: data, meta: m } = await leadService.getLeads({
        ...filters,
        search: debouncedSearch,
      });
      setLeads(data);
      setMeta(m);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const data = await leadService.getStats();
      setStats(data);
    } catch {
      // stats failing silently is acceptable
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  useEffect(() => { void fetchLeads(); }, [fetchLeads]);
  useEffect(() => { void fetchStats(); }, [fetchStats]);

  const updateFilter = useCallback(<K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : (value as number) }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const createLead = useCallback(async (data: LeadFormData): Promise<boolean> => {
    setIsMutating(true);
    try {
      await leadService.createLead(data);
      toast.success('Lead created successfully');
      await Promise.all([fetchLeads(), fetchStats()]);
      return true;
    } catch {
      toast.error('Failed to create lead');
      return false;
    } finally {
      setIsMutating(false);
    }
  }, [fetchLeads, fetchStats]);

  const updateLead = useCallback(async (id: string, data: Partial<LeadFormData>): Promise<boolean> => {
    setIsMutating(true);
    try {
      await leadService.updateLead(id, data);
      toast.success('Lead updated successfully');
      await Promise.all([fetchLeads(), fetchStats()]);
      return true;
    } catch {
      toast.error('Failed to update lead');
      return false;
    } finally {
      setIsMutating(false);
    }
  }, [fetchLeads, fetchStats]);

  const deleteLead = useCallback(async (id: string): Promise<boolean> => {
    setIsMutating(true);
    try {
      await leadService.deleteLead(id);
      toast.success('Lead deleted');
      await Promise.all([fetchLeads(), fetchStats()]);
      return true;
    } catch {
      toast.error('Failed to delete lead');
      return false;
    } finally {
      setIsMutating(false);
    }
  }, [fetchLeads, fetchStats]);

  const exportCSV = useCallback(async () => {
    try {
      await leadService.exportCSV();
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  }, []);

  return {
    leads, stats, meta, filters, isLoading, isStatsLoading, isMutating,
    updateFilter, resetFilters,
    createLead, updateLead, deleteLead, exportCSV,
    refetch: fetchLeads,
  };
}
