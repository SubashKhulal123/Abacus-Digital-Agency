import { cn } from '@lib/utils';

/**
 * Shimmer loading placeholder. Used across every section while its
 * React Query request is in flight, so the layout never jumps once
 * real content arrives.
 */
export default function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gradient-to-r from-bg-surface via-bg-elevated to-bg-surface bg-[length:200%_100%]',
        className
      )}
    />
  );
}
