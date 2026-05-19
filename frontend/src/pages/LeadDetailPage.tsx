import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/services/api';
import { leadService } from '@/services/lead.service';
import { Lead } from '@/types';

export const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await leadService.getLeadById(id);
        setLead(data ?? null);
        if (!data) setError('Lead not found');
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleDelete = async () => {
    if (!lead || !window.confirm(`Delete lead "${lead.name}"?`)) return;
    try {
      await leadService.deleteLead(lead._id);
      toast.success('Lead deleted');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading lead details..." />;
  }

  if (error || !lead) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-700 dark:text-red-400">{error || 'Lead not found'}</p>
        <Link to="/dashboard" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
      >
        ← Back to Dashboard
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">{lead.email}</p>
          </div>
          <Badge status={lead.status} />
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</dt>
            <dd className="mt-1 text-gray-900 dark:text-white">{lead.source}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</dt>
            <dd className="mt-1 text-gray-900 dark:text-white">
              {new Date(lead.createdAt).toLocaleString()}
            </dd>
          </div>
          {lead.createdBy && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created By</dt>
              <dd className="mt-1 text-gray-900 dark:text-white">
                {lead.createdBy.name} ({lead.createdBy.email})
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-8 flex gap-3">
          <Button onClick={() => navigate('/dashboard')}>Back</Button>
          {isAdmin && (
            <Button variant="danger" onClick={handleDelete}>
              Delete Lead
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
