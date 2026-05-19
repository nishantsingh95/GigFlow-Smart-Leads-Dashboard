import { PaginationMeta } from '@/types';
import { Button } from './Button';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { currentPage, totalPages, totalRecords, hasNextPage, hasPrevPage } = pagination;

  if (totalRecords === 0) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing page {currentPage} of {totalPages} ({totalRecords} total leads)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span className="px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentPage}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
