import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LeadFiltersBar } from '@/components/leads/LeadFilters';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadTable } from '@/components/leads/LeadTable';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { useAuth } from '@/contexts/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { getErrorMessage } from '@/services/api';
import { leadService } from '@/services/lead.service';
import { Lead, LeadFilters, LeadFormData, PaginationMeta } from '@/types';

const defaultFilters: LeadFilters = {
  status: '',
  source: '',
  search: '',
  sort: 'latest',
  page: 1,
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryFilters: LeadFilters = {
        ...filters,
        search: debouncedSearch,
      };
      const result = await leadService.getLeads(queryFilters);
      setLeads(result.leads);
      setPagination(result.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const handleCreate = async (data: LeadFormData) => {
    try {
      await leadService.createLead(data);
      toast.success('Lead created successfully');
      setIsCreateOpen(false);
      fetchLeads();
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleUpdate = async (data: LeadFormData) => {
    if (!editingLead) return;
    try {
      await leadService.updateLead(editingLead._id, data);
      toast.success('Lead updated successfully');
      setEditingLead(null);
      fetchLeads();
    } catch (err) {
      toast.error(getErrorMessage(err));
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deletingLead) return;
    try {
      await leadService.deleteLead(deletingLead._id);
      toast.success('Lead deleted successfully');
      setDeletingLead(null);
      fetchLeads();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      await leadService.exportCSV({
        status: filters.status,
        source: filters.source,
        search: debouncedSearch,
        sort: filters.sort,
      });
      toast.success('CSV exported successfully');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isAdmin
              ? 'Manage and track all your sales leads'
              : 'View leads (read-only access)'}
          </p>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={handleExportCSV}
              isLoading={isExporting}
            >
              Export CSV
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>+ Add Lead</Button>
          </div>
        )}
      </div>

      <LeadFiltersBar
        filters={filters}
        onChange={setFilters}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
      />

      {isLoading ? (
        <LoadingSpinner message="Loading leads..." />
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <p className="font-medium">Failed to load leads</p>
          <p className="mt-1 text-sm">{error}</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={fetchLeads}>
            Retry
          </Button>
        </div>
      ) : leads.length === 0 ? (
        <EmptyState
          title="No leads found"
          description={
            isAdmin
              ? 'Try adjusting your filters or create a new lead to get started.'
              : 'Try adjusting your filters.'
          }
          action={
            isAdmin ? (
              <Button onClick={() => setIsCreateOpen(true)}>+ Add Lead</Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <LeadTable
            leads={leads}
            canManage={!!isAdmin}
            onEdit={setEditingLead}
            onDelete={setDeletingLead}
          />
          {pagination && (
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          )}
        </>
      )}

      {isAdmin && (
        <>
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Lead"
        footer={null}
      >
        <LeadForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          submitLabel="Create Lead"
        />
      </Modal>

      <Modal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        title="Edit Lead"
        footer={null}
      >
        {editingLead && (
          <LeadForm
            initialData={{
              name: editingLead.name,
              email: editingLead.email,
              status: editingLead.status,
              source: editingLead.source,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingLead(null)}
            submitLabel="Update Lead"
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        title="Delete Lead"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeletingLead(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete{' '}
          <strong>{deletingLead?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
        </>
      )}
    </div>
  );
};
