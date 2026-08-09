import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@lib/utils';

/**
 * A button that subtly follows the cursor within its bounds ("magnetic"
 * hover effect popularized by Cuberto-style agency sites), then springs
 * back to center on mouse leave. Wraps children (usually <Button>) —
 * pass any clickable element.
 */
export default function MagneticButton({ children, className, strength = 0.35 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.3 }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  );
}
