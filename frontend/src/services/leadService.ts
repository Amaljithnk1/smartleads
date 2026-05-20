import api from './api';
import { Lead, LeadFormData, LeadFilters, LeadsResponse, LeadStats, ApiResponse } from '../types';

export const leadService = {
  async getLeads(filters: Partial<LeadFilters>): Promise<LeadsResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    if (filters.limit) params.append('limit', String(filters.limit));

    const res = await api.get<ApiResponse<{ leads: Lead[] }>>(`/leads?${params}`);
    return { leads: res.data.data!.leads, meta: res.data.meta! };
  },

  async getLeadById(id: string): Promise<Lead> {
    const res = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return res.data.data!.lead;
  },

  async createLead(data: LeadFormData): Promise<Lead> {
    const res = await api.post<ApiResponse<{ lead: Lead }>>('/leads', data);
    return res.data.data!.lead;
  },

  async updateLead(id: string, data: Partial<LeadFormData>): Promise<Lead> {
    const res = await api.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, data);
    return res.data.data!.lead;
  },

  async deleteLead(id: string): Promise<void> {
    await api.delete(`/leads/${id}`);
  },

  async getStats(): Promise<LeadStats> {
    const res = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    return res.data.data!;
  },

  async exportCSV(): Promise<void> {
    const res = await api.get('/leads/export/csv', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
