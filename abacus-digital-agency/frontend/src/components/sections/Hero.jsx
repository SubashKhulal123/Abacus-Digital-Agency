import { motion } from 'framer-motion';
import { FiPlay } from 'react-icons/fi';
import Container from '@components/common/Container';
import RevealText from '@components/common/RevealText';
import GradientBlob from '@components/common/GradientBlob';
import FloatingElements from '@components/common/FloatingElements';
import AnimatedCounter from '@components/common/AnimatedCounter';
import CTAButton from '@components/common/CTAButton';
import Skeleton from '@components/common/Skeleton';
import { useStatistics } from '@hooks/useContent';

export default function Hero() {
  const { data: stats, isLoading } = useStatistics();

  return (
    <section className="relative overflow-hidden pb-24 pt-40 sm:pt-48">
      <GradientBlob className="-left-40 -top-40" size={600} />
      <GradientBlob className="-right-40 top-1/3" size={500} variant="subtle" />
      <FloatingElements />

      <Container className="relative">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg-surface/60 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-accent"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Available for new projects — Q1 2026
          </motion.div>

          <h1 className="font-display text-[clamp(2.75rem,7vw,4.75rem)] font-semibold leading-[1.05] tracking-tight">
            <RevealText text="We design and build" />
            <br />
            <RevealText text="products people" delay={0.15} />{' '}
            <span className="text-gradient">
              <RevealText text="actually love" delay={0.3} as="span" />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mx-auto mt-8 max-w-2xl text-balance text-lg text-text-secondary"
          >
            Abacus Digital Agency is a product design and engineering studio for ambitious
            companies — from first sketch to production deployment, one accountable team.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <CTAButton to="/contact" size="lg">
              Start a Project
            </CTAButton>
            <CTAButton to="/portfolio" variant="glass" size="lg">
              <span className="inline-flex items-center gap-2">
                <FiPlay className="h-3.5 w-3.5" /> View Our Work
              </span>
            </CTAButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mx-auto mt-24 grid max-w-4xl grid-cols-2 gap-8 border-t border-border-subtle pt-10 sm:grid-cols-4"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            : stats?.map((stat) => (
                <div key={stat._id} className="text-center">
                  <p className="font-display text-3xl font-semibold sm:text-4xl">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </p>
                  <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
                </div>
              ))}
        </motion.div>
      </Container>
    </section>
  );
}
