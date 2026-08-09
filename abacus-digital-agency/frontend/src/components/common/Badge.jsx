import { cn } from '@lib/utils';

export default function Badge({ children, className, variant = 'default' }) {
  const variants = {
    default: 'bg-accent/10 text-accent border-accent/20',
    neutral: 'bg-bg-surface text-text-secondary border-border',
    success: 'bg-success/10 text-success border-success/20',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
