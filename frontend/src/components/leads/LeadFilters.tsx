import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LEAD_SOURCES, LEAD_STATUSES, LeadFilters as LeadFiltersType } from '@/types';

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onChange: (filters: LeadFiltersType) => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
}

export const LeadFiltersBar = ({
  filters,
  onChange,
  searchInput,
  onSearchChange,
}: LeadFiltersProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Search"
        placeholder="Search by name or email..."
        value={searchInput}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select
        label="Status"
        value={filters.status || ''}
        onChange={(e) =>
          onChange({
            ...filters,
            status: e.target.value as LeadFiltersType['status'],
            page: 1,
          })
        }
        placeholder="All Statuses"
        options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))}
      />
      <Select
        label="Source"
        value={filters.source || ''}
        onChange={(e) =>
          onChange({
            ...filters,
            source: e.target.value as LeadFiltersType['source'],
            page: 1,
          })
        }
        placeholder="All Sources"
        options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))}
      />
      <Select
        label="Sort By"
        value={filters.sort}
        onChange={(e) =>
          onChange({
            ...filters,
            sort: e.target.value as LeadFiltersType['sort'],
            page: 1,
          })
        }
        options={[
          { value: 'latest', label: 'Latest First' },
          { value: 'oldest', label: 'Oldest First' },
        ]}
      />
    </div>
  );
};
