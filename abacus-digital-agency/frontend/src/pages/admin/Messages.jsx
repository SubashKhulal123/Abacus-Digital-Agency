import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiCheckSquare } from 'react-icons/fi';
import AdminPageHeader from '@components/admin/AdminPageHeader';
import Skeleton from '@components/common/Skeleton';
import EmptyState from '@components/common/EmptyState';
import { useAdminList } from '@hooks/useAdminResource';
import { cn } from '@lib/utils';

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function Messages() {
  const [status, setStatus] = useState('');
  const { data, isLoading } = useAdminList('messages', status ? { status } : {});
  const messages = data?.data || [];

  useEffect(() => {
    document.title = 'Messages — Admin';
  }, []);

  return (
    <div>
      <AdminPageHeader title="Contact Messages" description="Inquiries submitted through the public contact form." />

      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-medium transition-colors',
              status === tab.value
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border text-text-secondary hover:border-accent/40'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-panel divide-y divide-border-subtle overflow-hidden rounded-2xl">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
        ) : messages.length === 0 ? (
          <EmptyState message="No messages found." />
        ) : (
          messages.map((m) => (
            <Link
              key={m._id}
              to={`/admin/messages/${m._id}`}
              className={cn(
                'flex items-start gap-4 px-5 py-4 transition-colors hover:bg-bg-surface/60',
                m.status === 'unread' && 'bg-accent/5'
              )}
            >
              <span className={cn('mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', m.status === 'unread' ? 'bg-accent/10 text-accent' : 'bg-bg-surface text-text-muted')}>
                {m.status === 'unread' ? <FiMail className="h-4 w-4" /> : <FiCheckSquare className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn('truncate text-sm', m.status === 'unread' ? 'font-semibold' : 'font-medium')}>
                    {m.name} <span className="font-normal text-text-muted">— {m.email}</span>
                  </p>
                  <span className="shrink-0 text-xs text-text-muted">{timeAgo(m.createdAt)}</span>
                </div>
                <p className="mt-1 truncate text-sm text-text-secondary">{m.subject}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-text-muted">{m.message}</p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize',
                  m.status === 'unread' && 'bg-accent/10 text-accent',
                  m.status === 'read' && 'bg-warning/10 text-warning',
                  m.status === 'replied' && 'bg-success/10 text-success',
                  m.status === 'archived' && 'bg-text-muted/10 text-text-muted'
                )}
              >
                {m.status}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
