import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSend, FiCheckCircle, FiArchive } from 'react-icons/fi';
import Skeleton from '@components/common/Skeleton';
import { useAdminOne } from '@hooks/useAdminResource';
import { useReplyToMessage, useUpdateMessageStatus } from '@hooks/useAdmin';

export default function MessageDetail() {
  const { id } = useParams();
  const { data: message, isLoading } = useAdminOne('messages', id);
  const replyMutation = useReplyToMessage();
  const statusMutation = useUpdateMessageStatus();
  const [replyText, setReplyText] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = 'Message — Admin';
  }, []);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await replyMutation.mutateAsync({ id, message: replyText });
      setSent(true);
      setReplyText('');
      toast.success('Reply sent successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to send reply');
    }
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/admin/messages" className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent">
        <FiArrowLeft className="h-4 w-4" /> All Messages
      </Link>

      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <h1 className="font-display text-xl font-semibold">{message.subject}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              From <span className="font-medium text-text">{message.name}</span> ({message.email})
            </p>
            {message.company && <p className="text-xs text-text-muted">{message.company}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => statusMutation.mutate({ id, status: 'archived' })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium transition-colors hover:border-accent hover:text-accent"
            >
              <FiArchive className="h-3.5 w-3.5" /> Archive
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-border-subtle py-6 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-text-muted">Phone</p>
            <p>{message.phone || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Budget</p>
            <p className="capitalize">{message.budgetRange?.replace(/-/g, ' ') || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Project Type</p>
            <p>{message.projectType || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Received</p>
            <p>{new Date(message.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="py-6">
          <p className="mb-2 text-xs uppercase tracking-widest text-text-muted">Message</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
        </div>

        {message.adminNotes && (
          <div className="rounded-lg bg-bg-surface/60 p-4 text-xs text-text-secondary">
            <p className="mb-1 font-medium text-text-muted">Notes / Reply History</p>
            <p className="whitespace-pre-wrap">{message.adminNotes}</p>
          </div>
        )}

        <form onSubmit={handleReply} className="mt-6 border-t border-border-subtle pt-6">
          <label className="mb-2 block text-sm font-medium text-text-secondary">Reply via email</label>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={5}
            placeholder="Type your reply..."
            className="w-full rounded-lg border border-border bg-bg-surface/50 px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          {sent && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-success">
              <FiCheckCircle className="h-3.5 w-3.5" /> Reply sent successfully
            </p>
          )}
          {replyMutation.isError && <p className="mt-2 text-xs text-danger">{replyMutation.error?.message}</p>}
          <button
            type="submit"
            disabled={replyMutation.isPending}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-50"
          >
            <FiSend className="h-4 w-4" /> {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
          </button>
        </form>
      </div>
    </div>
  );
}
