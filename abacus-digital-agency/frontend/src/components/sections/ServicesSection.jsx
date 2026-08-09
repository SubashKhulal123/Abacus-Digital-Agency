import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import CTAButton from '@components/common/CTAButton';
import { useServices } from '@hooks/useContent';
import { getIcon } from '@utils/getIcon';

export default function ServicesSection() {
  const { data: services, isLoading, isError } = useServices({ limit: 6 });

  return (
    <section id="services" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Everything you need to"
          highlight="ship a great product"
          description="Full-stack capability under one roof — design, engineering, and everything in between."
        />

        {isError && <ErrorState message="We couldn't load our services right now." />}

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-2xl" />
              ))
            : services?.map((service, i) => {
                const Icon = getIcon(service.icon);
                return (
                  <motion.div
                    key={service._id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
                  >
                    <Link
                      to={`/services/${service.slug}`}
                      data-cursor-hover
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-surface/30 p-8 transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-glow"
                    >
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mb-3 font-display text-xl font-semibold">{service.title}</h3>
                      <p className="mb-6 flex-1 text-sm leading-relaxed text-text-secondary">
                        {service.shortDescription}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                        Learn more
                        <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
        </div>

        <div className="mt-14 flex justify-center">
          <CTAButton to="/services" variant="outline" size="lg">
            View All Services
          </CTAButton>
        </div>
      </Container>
    </section>
  );
}
