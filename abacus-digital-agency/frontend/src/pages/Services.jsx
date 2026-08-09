import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import PageHero from '@components/common/PageHero';
import Container from '@components/common/Container';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import ProcessSection from '@components/sections/ProcessSection';
import IndustriesSection from '@components/sections/IndustriesSection';
import PricingSection from '@components/sections/PricingSection';
import FaqSection from '@components/sections/FaqSection';
import CTASection from '@components/sections/CTASection';
import SEO from '@components/common/SEO';
import { useServices } from '@hooks/useContent';
import { getIcon } from '@utils/getIcon';

export default function Services() {
  const { data: services, isLoading, isError } = useServices();

  return (
    <>
      <SEO
        title="Services"
        description="Product design, web and mobile development, e-commerce, brand identity, and AI engineering — full-stack capability under one roof."
        url="/services"
      />
      <PageHero
        eyebrow="Services"
        title="Full-stack capability,"
        highlight="one accountable team"
        description="From product design to production infrastructure — everything a great digital product needs, under one roof."
      />

      <section className="py-16">
        <Container>
          {isError && <ErrorState message="We couldn't load our services right now." />}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-2xl" />
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
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-surface/30 p-8 transition-all duration-500 ease-premium hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-glow"
                      >
                        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="mb-3 font-display text-xl font-semibold">{service.title}</h3>
                        <p className="mb-5 flex-1 text-sm leading-relaxed text-text-secondary">
                          {service.shortDescription}
                        </p>
                        <ul className="mb-6 space-y-2">
                          {service.features?.slice(0, 3).map((f) => (
                            <li key={f} className="text-xs text-text-muted">
                              — {f}
                            </li>
                          ))}
                        </ul>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                          Explore service
                          <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
          </div>
        </Container>
      </section>

      <ProcessSection />
      <IndustriesSection />
      <PricingSection />
      <FaqSection />
      <CTASection />
    </>
  );
}
