import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiBell, FiCheck } from 'react-icons/fi';
import { useAdminNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@hooks/useAdmin';
import { useClickOutside } from '@hooks/useClickOutside';
import { cn } from '@lib/utils';

const TYPE_DOT = { info: 'bg-accent', success: 'bg-success', warning: 'bg-warning', error: 'bg-danger' };

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { data } = useAdminNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.data || [];
  const unreadCount = data?.meta?.unreadCount || 0;

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:border-accent hover:text-accent"
      >
        <FiBell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="glass-panel absolute right-0 top-full z-50 mt-3 w-80 overflow-hidden rounded-xl"
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  <FiCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-text-muted">No notifications yet</p>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n._id}
                    to={n.link || '#'}
                    onClick={() => !n.isRead && markRead.mutate(n._id)}
                    className={cn(
                      'flex items-start gap-3 border-b border-border-subtle px-4 py-3 transition-colors hover:bg-bg-surface',
                      !n.isRead && 'bg-accent/5'
                    )}
                  >
                    <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', TYPE_DOT[n.type])} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{n.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">{n.message}</p>
                      <p className="mt-1 text-[10px] text-text-muted">{timeAgo(n.createdAt)}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
