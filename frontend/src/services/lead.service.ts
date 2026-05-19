import { api } from './api';
import { ApiResponse, Lead, LeadFilters, LeadFormData, PaginationMeta } from '@/types';

export const leadService = {
  getLeads: async (filters: LeadFilters) => {
    const params: Record<string, string> = {
      sort: filters.sort,
      page: String(filters.page),
    };

    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search) params.search = filters.search;

    const { data } = await api.get<ApiResponse<{ leads: Lead[] }>>('/leads', { params });
    return {
      leads: data.data?.leads ?? [],
      pagination: data.pagination as PaginationMeta,
      message: data.message,
    };
  },

  getLeadById: async (id: string) => {
    const { data } = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return data.data?.lead;
  },

  createLead: async (payload: LeadFormData) => {
    const { data } = await api.post<ApiResponse<{ lead: Lead }>>('/leads', payload);
    return data.data?.lead;
  },

  updateLead: async (id: string, payload: Partial<LeadFormData>) => {
    const { data } = await api.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, payload);
    return data.data?.lead;
  },

  deleteLead: async (id: string) => {
    await api.delete(`/leads/${id}`);
  },

  exportCSV: async (filters: Omit<LeadFilters, 'page'>) => {
    const params: Record<string, string> = { sort: filters.sort };
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.search) params.search = filters.search;

    const response = await api.get('/leads/export/csv', {
      params,
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
