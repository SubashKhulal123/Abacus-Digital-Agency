import { cn } from '@lib/utils';

/**
 * Decorative, animated blurred gradient blob used as ambient background
 * texture behind hero/CTA sections. Purely presentational — aria-hidden.
 */
export default function GradientBlob({ className, size = 500, variant = 'accent' }) {
  const gradients = {
    accent: 'from-accent/40 via-accent-secondary/20 to-transparent',
    subtle: 'from-accent/15 via-transparent to-transparent',
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute rounded-full bg-gradient-to-br blur-3xl animate-pulse-glow',
        gradients[variant],
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
