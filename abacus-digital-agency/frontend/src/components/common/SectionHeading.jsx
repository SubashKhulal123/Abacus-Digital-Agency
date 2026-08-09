import { motion } from 'framer-motion';
import { cn } from '@lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

/**
 * Standard section header: small eyebrow label, large display heading
 * (with optional gradient-highlighted span), and an optional description.
 * Animates in on scroll via Framer Motion's whileInView.
 */
export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = 'center',
  className,
}) {
  return (
    <div
      className={cn(
        'mx-auto max-w-3xl',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          custom={0}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface/60 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-accent"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        custom={1}
        className="text-balance font-display text-[clamp(1.875rem,4.5vw,3rem)] font-semibold leading-[1.1]"
      >
        {title} {highlight && <span className="text-gradient">{highlight}</span>}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          custom={2}
          className="mx-auto mt-5 max-w-2xl text-balance text-base text-text-secondary sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
