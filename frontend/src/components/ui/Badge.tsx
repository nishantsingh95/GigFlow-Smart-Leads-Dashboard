import { LeadStatus } from '@/types';

interface BadgeProps {
  status: LeadStatus;
}

const statusStyles: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Qualified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export const Badge = ({ status }: BadgeProps) => {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};
