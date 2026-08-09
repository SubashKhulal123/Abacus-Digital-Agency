import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload } from 'react-icons/fi';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import Skeleton from '@components/common/Skeleton';
import EmptyState from '@components/common/EmptyState';
import { useAdminList, useAdminExportCSV } from '@hooks/useAdminResource';
import { cn } from '@lib/utils';

const STATUS_TABS = ['', 'pending', 'reviewed', 'shortlisted', 'interviewing', 'hired', 'rejected'];
const STATUS_COLORS = {
  pending: 'bg-warning/10 text-warning',
  reviewed: 'bg-accent/10 text-accent',
  shortlisted: 'bg-success/10 text-success',
  interviewing: 'bg-accent/10 text-accent',
  hired: 'bg-success/10 text-success',
  rejected: 'bg-danger/10 text-danger',
};

export default function Applications() {
  const [status, setStatus] = useState('');
  const { data, isLoading } = useAdminList('applications', status ? { status } : {});
  const exportMutation = useAdminExportCSV('applications');
  const applications = data?.data || [];

  useEffect(() => {
    document.title = 'Applications — Admin';
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Career Applications"
        description="Candidates who applied through the careers page."
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatus(tab)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-medium capitalize transition-colors',
                status === tab ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-text-secondary hover:border-accent/40'
              )}
            >
              {tab || 'All'}
            </button>
          ))}
        </div>
        <button
          onClick={() => exportMutation.mutate()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-accent hover:text-accent"
        >
          <FiDownload className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="glass-panel divide-y divide-border-subtle overflow-hidden rounded-2xl">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
        ) : applications.length === 0 ? (
          <EmptyState message="No applications found." />
        ) : (
          applications.map((a) => (
            <Link
              key={a._id}
              to={`/admin/applications/${a._id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-bg-surface/60"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{a.name}</p>
                <p className="truncate text-xs text-text-muted">{a.email} · {a.jobPost?.title}</p>
              </div>
              <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize', STATUS_COLORS[a.status])}>
                {a.status}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
