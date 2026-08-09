import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin, FiBriefcase, FiClock } from 'react-icons/fi';
import PageHero from '@components/common/PageHero';
import Container from '@components/common/Container';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import EmptyState from '@components/common/EmptyState';
import SEO from '@components/common/SEO';
import ValuesSection from '@components/sections/ValuesSection';
import CTASection from '@components/sections/CTASection';
import { useJobs } from '@hooks/useContent';

export default function Careers() {
  const { data: jobs, isLoading, isError } = useJobs();

  return (
    <>
      <SEO
        title="Careers"
        description="Join a small, senior team of designers and engineers at Abacus Digital Agency. Explore open roles."
        url="/careers"
      />
      <PageHero
        eyebrow="Careers"
        title="Build your best work"
        highlight="with us"
        description="We're a small, senior team — every hire meaningfully shapes what we build and how we work."
      />

      <section className="pb-24">
        <Container className="max-w-3xl">
          {isError && <ErrorState message="We couldn't load open roles right now." />}

          <div className="space-y-3">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
              : jobs?.map((job, i) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                  >
                    <Link
                      to={`/careers/${job.slug}`}
                      data-cursor-hover
                      className="group flex flex-col items-start justify-between gap-4 rounded-xl border border-border p-6 transition-colors hover:border-accent/40 sm:flex-row sm:items-center"
                    >
                      <div>
                        <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-accent">
                          {job.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                          <span className="inline-flex items-center gap-1">
                            <FiBriefcase className="h-3 w-3" /> {job.department}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FiMapPin className="h-3 w-3" /> {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1 capitalize">
                            <FiClock className="h-3 w-3" /> {job.type?.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent">
                        Apply now
                        <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
          </div>

          {!isLoading && jobs?.length === 0 && (
            <EmptyState message="No open roles right now — check back soon, or reach out anyway." />
          )}
        </Container>
      </section>

      <ValuesSection />
      <CTASection
        eyebrow="Don't See a Fit?"
        title="We're always open to"
        highlight="great people"
        description="Send us your portfolio anyway — we'll keep you in mind for what's next."
        primaryLabel="Get in Touch"
        primaryTo="/contact"
      />
    </>
  );
}
