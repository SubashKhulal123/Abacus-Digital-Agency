import { motion } from 'framer-motion';
import { cn } from '@lib/utils';

/**
 * Animated horizontal progress bar — fills to `value`% when scrolled
 * into view. Used for skill levels, stat breakdowns, etc.
 */
export default function ProgressBar({ label, value, className }) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-text-secondary">{label}</span>
          <span className="font-mono text-xs text-accent">{value}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-surface">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-secondary"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
