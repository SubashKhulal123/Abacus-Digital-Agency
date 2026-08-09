import { motion } from 'framer-motion';
import { cn } from '@lib/utils';

/**
 * Reveals an image with a clip-path wipe + subtle scale-down-to-rest,
 * used for portfolio thumbnails, team avatars, and case study imagery.
 */
export default function ImageReveal({ src, alt, className, imgClassName, delay = 0 }) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <motion.div
        className="absolute inset-0 z-10 bg-accent"
        initial={{ scaleX: 1 }}
        whileInView={{ scaleX: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: 'right' }}
      />
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn('h-full w-full object-cover', imgClassName)}
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
