import { motion } from 'framer-motion';
import AnimatedCounter from '@components/common/AnimatedCounter';
import { cn } from '@lib/utils';

export default function StatCard({ label, value, icon: Icon, suffix = '', trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel rounded-2xl p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </span>
        {trend !== undefined && (
          <span className={cn('text-xs font-medium', trend >= 0 ? 'text-success' : 'text-danger')}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="font-display text-3xl font-semibold">
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
    </motion.div>
  );
}
