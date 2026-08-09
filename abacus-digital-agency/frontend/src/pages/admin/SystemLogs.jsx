import { useEffect, useState } from 'react';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import Skeleton from '@components/common/Skeleton';
import EmptyState from '@components/common/EmptyState';
import { useAdminLogs } from '@hooks/useAdmin';
import { cn } from '@lib/utils';

const LEVEL_COLORS = { INFO: 'text-accent', WARN: 'text-warning', ERROR: 'text-danger', DEBUG: 'text-text-muted' };

export default function SystemLogs() {
  const [level, setLevel] = useState('');
  const { data, isLoading } = useAdminLogs(level ? { level } : {});

  useEffect(() => {
    document.title = 'System Logs — Admin';
  }, []);

  return (
    <div>
      <AdminPageHeader title="System Logs" description="Raw application logs from the backend server." />

      <div className="mb-5 flex flex-wrap gap-2">
        {['', 'INFO', 'WARN', 'ERROR'].map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
              level === l ? 'border-accent bg-accent text-accent-foreground' : 'border-border text-text-secondary hover:border-accent/40'
            )}
          >
            {l || 'All'}
          </button>
        ))}
      </div>

      <div className="glass-panel max-h-[600px] overflow-y-auto rounded-2xl bg-black/40 p-4 font-mono text-xs">
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : data?.lines?.length === 0 ? (
          <EmptyState message="No logs recorded yet." />
        ) : (
          data.lines.map((line, i) => {
            const levelMatch = line.match(/\[(INFO|WARN|ERROR|DEBUG)\]/);
            const lvl = levelMatch?.[1];
            return (
              <p key={i} className={cn('whitespace-pre-wrap py-0.5', LEVEL_COLORS[lvl] || 'text-text-secondary')}>
                {line}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
}
