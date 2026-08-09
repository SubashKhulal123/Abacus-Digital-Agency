import { cn } from '@lib/utils';

export default function ToggleInput({ value, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex items-center gap-3"
    >
      <span
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          value ? 'bg-accent' : 'bg-border'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            value ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
}
