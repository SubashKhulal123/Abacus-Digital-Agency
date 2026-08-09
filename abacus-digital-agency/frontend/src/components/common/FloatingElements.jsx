import { motion } from 'framer-motion';

/**
 * A handful of small floating geometric shapes drifting subtly in the
 * background — used in the Hero to add depth without distraction.
 * Respects reduced-motion via CSS (see styles/index.css global rule).
 */
export default function FloatingElements() {
  const shapes = [
    { top: '15%', left: '8%', size: 14, delay: 0, duration: 6 },
    { top: '65%', left: '5%', size: 8, delay: 1.2, duration: 8 },
    { top: '25%', left: '92%', size: 10, delay: 0.6, duration: 7 },
    { top: '75%', left: '88%', size: 16, delay: 1.8, duration: 9 },
    { top: '45%', left: '95%', size: 6, delay: 0.3, duration: 5 },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-accent/30 bg-accent/10"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          animate={{ y: [0, -18, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
