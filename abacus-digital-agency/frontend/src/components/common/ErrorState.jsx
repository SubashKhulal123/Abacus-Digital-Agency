import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Shown when a resource request fails (network error, 5xx, etc.) so
 * the section degrades gracefully instead of throwing / rendering blank.
 */
export default function ErrorState({ message = "We couldn't load this content right now." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-danger/30 bg-danger/5 py-16 text-center">
      <FiAlertTriangle className="h-8 w-8 text-danger" />
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}
