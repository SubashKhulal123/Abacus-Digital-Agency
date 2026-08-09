import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A slim fixed progress bar at the very top of the viewport, tracking
 * scroll position through the page. Common on editorial/blog sites to
 * give readers a sense of how much content remains. Spring-smoothed so
 * it doesn't feel mechanically linear.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-accent to-accent-secondary"
      style={{ scaleX }}
    />
  );
}
