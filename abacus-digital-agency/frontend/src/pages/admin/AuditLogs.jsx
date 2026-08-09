import { useEffect, useState } from 'react';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import Skeleton from '@components/common/Skeleton';
import EmptyState from '@components/common/EmptyState';
import { useAuditLogs } from '@hooks/useAdmin';

const ACTION_COLORS = {
  create: 'bg-success/10 text-success',
  update: 'bg-accent/10 text-accent',
  delete: 'bg-danger/10 text-danger',
  bulk_delete: 'bg-danger/10 text-danger',
  login: 'bg-accent/10 text-accent',
  status_change: 'bg-warning/10 text-warning',
  reply: 'bg-accent/10 text-accent',
  export: 'bg-text-muted/10 text-text-muted',
  import: 'bg-text-muted/10 text-text-muted',
  backup: 'bg-text-muted/10 text-text-muted',
};

export default function AuditLogs() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditLogs({ page });
  const logs = data?.data?.data || [];
  const meta = data?.data?.meta;

  useEffect(() => {
    document.title = 'Audit Logs — Admin';
  }, []);

  return (
    <div>
      <AdminPageHeader title="Audit Logs" description="A complete trail of every admin action taken in the system." />

      <div className="glass-panel divide-y divide-border-subtle overflow-hidden rounded-2xl">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)
        ) : logs.length === 0 ? (
          <EmptyState message="No audit logs recorded yet." />
        ) : (
          logs.map((log) => (
            <div key={log._id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{log.adminName}</span>{' '}
                  <span className="text-text-secondary">{log.description}</span>
                </p>
                <p className="text-xs text-text-muted">{new Date(log.createdAt).toLocaleString()}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase ${ACTION_COLORS[log.action] || 'bg-text-muted/10 text-text-muted'}`}>
                {log.action.replace('_', ' ')}
              </span>
            </div>
          ))
        )}
      </div>

      {meta?.totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">Previous</button>
          <span className="px-3 py-2 text-sm text-text-muted">{page} / {meta.totalPages}</span>
          <button disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
