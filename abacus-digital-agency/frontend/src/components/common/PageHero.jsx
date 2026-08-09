import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import GradientBlob from '@components/common/GradientBlob';

export default function PageHero({ eyebrow, title, highlight, description }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-40 sm:pt-48">
      <GradientBlob className="-left-32 -top-32" size={450} variant="subtle" />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          {eyebrow && (
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface/60 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {eyebrow}
            </p>
          )}
          <h1 className="text-balance font-display text-[clamp(2.25rem,6vw,3.75rem)] font-semibold leading-[1.1]">
            {title} {highlight && <span className="text-gradient">{highlight}</span>}
          </h1>
          {description && (
            <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-text-secondary">
              {description}
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
