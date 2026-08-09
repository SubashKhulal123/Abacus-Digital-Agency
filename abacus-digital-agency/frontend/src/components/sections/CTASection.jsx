import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import GradientBlob from '@components/common/GradientBlob';
import CTAButton from '@components/common/CTAButton';

export default function CTASection({
  eyebrow = "Let's Build Something",
  title = 'Have a project in mind?',
  highlight = "Let's talk.",
  description = "Tell us what you're building — we'll get back to you within one business day with real next steps.",
  primaryLabel = 'Start a Project',
  primaryTo = '/contact',
  secondaryLabel,
  secondaryTo,
}) {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <GradientBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" size={700} />
      <Container className="relative">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">{eyebrow}</p>
          <h2 className="text-balance font-display text-4xl font-semibold leading-tight sm:text-5xl">
            {title} <span className="text-gradient">{highlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-text-secondary">{description}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CTAButton to={primaryTo} size="lg">
              {primaryLabel}
            </CTAButton>
            {secondaryLabel && (
              <CTAButton to={secondaryTo} variant="outline" size="lg">
                {secondaryLabel}
              </CTAButton>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
