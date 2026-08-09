import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin, FiBriefcase } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import EmptyState from '@components/common/EmptyState';
import CTAButton from '@components/common/CTAButton';
import { useJobs } from '@hooks/useContent';

export default function CareerPreviewSection() {
  const { data: jobs, isLoading } = useJobs({ limit: 4 });

  return (
    <section id="careers" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Careers"
          title="Build your best work"
          highlight="with us"
          description="We're a small, senior team — every hire meaningfully shapes what we build and how we work."
        />

        <div className="mx-auto mt-16 max-w-3xl space-y-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
          ) : jobs?.length ? (
            jobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
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
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                      <span className="inline-flex items-center gap-1">
                        <FiBriefcase className="h-3 w-3" /> {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiMapPin className="h-3 w-3" /> {job.location}
                      </span>
                      <span className="capitalize">{job.type?.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent">
                    Apply now
                    <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))
          ) : (
            <EmptyState message="No open roles right now — check back soon." />
          )}
        </div>

        <div className="mt-14 flex justify-center">
          <CTAButton to="/careers" variant="outline" size="lg">
            View All Openings
          </CTAButton>
        </div>
      </Container>
    </section>
  );
}
