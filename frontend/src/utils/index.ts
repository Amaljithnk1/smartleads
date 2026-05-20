import { LeadStatus, LeadSource } from '../types';

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
};

export const getAvatarColor = (name: string): { bg: string; text: string } => {
  const colors = [
    { bg: 'rgba(0,212,255,0.15)', text: '#00d4ff' },
    { bg: 'rgba(168,85,247,0.15)', text: '#a855f7' },
    { bg: 'rgba(255,140,0,0.15)', text: '#ff8c00' },
    { bg: 'rgba(0,255,136,0.15)', text: '#00ff88' },
    { bg: 'rgba(255,68,102,0.15)', text: '#ff4466' },
    { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const getStatusBadgeClass = (status: LeadStatus): string => {
  const map: Record<LeadStatus, string> = {
    New: 'badge-new',
    Contacted: 'badge-contacted',
    Qualified: 'badge-qualified',
    Lost: 'badge-lost',
  };
  return `badge ${map[status]}`;
};

export const getSourceBadgeClass = (source: LeadSource): string => {
  const map: Record<LeadSource, string> = {
    Website: 'badge-website',
    Instagram: 'badge-instagram',
    Referral: 'badge-referral',
  };
  return `badge ${map[source]}`;
};

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosErr = error as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? 'Something went wrong';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
};
