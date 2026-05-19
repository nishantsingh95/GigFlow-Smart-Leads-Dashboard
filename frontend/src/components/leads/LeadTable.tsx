import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Lead } from '@/types';

interface LeadTableProps {
  leads: Lead[];
  canManage: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadTable = ({ leads, canManage, onEdit, onDelete }: LeadTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Source
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
              Created
            </th>
            {canManage && (
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {leads.map((lead) => (
            <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="whitespace-nowrap px-4 py-3">
                <Link
                  to={`/leads/${lead._id}`}
                  className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  {lead.name}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                {lead.email}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <Badge status={lead.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                {lead.source}
              </td>
              <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400 md:table-cell">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              {canManage && (
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(lead)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete(lead)}>
                      Delete
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
