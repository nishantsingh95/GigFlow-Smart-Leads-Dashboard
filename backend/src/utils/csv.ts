import { ILead } from '../models/Lead';

export const leadsToCSV = (leads: ILead[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => {
    const createdAt = lead.createdAt.toISOString();
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    return [
      escape(lead.name),
      escape(lead.email),
      escape(lead.status),
      escape(lead.source),
      escape(createdAt),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};
