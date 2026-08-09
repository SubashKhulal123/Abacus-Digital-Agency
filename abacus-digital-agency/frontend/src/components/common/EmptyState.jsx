import { FiInbox } from 'react-icons/fi';

/**
 * Shown when a resource list request succeeds but returns zero items
 * (e.g. no blog posts published yet) — never leaves a blank gap.
 */
export default function EmptyState({ message = 'Nothing to show here yet.', icon: Icon = FiInbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
      <Icon className="h-8 w-8 text-text-muted" />
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}
