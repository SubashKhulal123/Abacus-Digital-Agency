import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiArrowLeft } from 'react-icons/fi';
import Container from '@components/common/Container';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import GradientBlob from '@components/common/GradientBlob';
import SEO from '@components/common/SEO';
import CTASection from '@components/sections/CTASection';
import { useService } from '@hooks/useContent';
import { getIcon } from '@utils/getIcon';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: service, isLoading, isError } = useService(slug);

  if (isLoading) {
    return (
      <Container className="pb-24 pt-40">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-6 h-24 w-full" />
      </Container>
    );
  }

  if (isError || !service) {
    return (
      <Container className="pb-24 pt-40">
        <ErrorState message="We couldn't find that service." />
      </Container>
    );
  }

  const Icon = getIcon(service.icon);

  return (
    <>
      <SEO
        title={service.title}
        description={service.shortDescription}
        image={service.coverImage?.url}
        url={`/services/${service.slug}`}
      />
      <section className="relative overflow-hidden pb-16 pt-40 sm:pt-48">
        <GradientBlob className="-right-32 -top-20" size={450} variant="subtle" />
        <Container className="relative">
          <Link
            to="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <FiArrowLeft className="h-4 w-4" /> All Services
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-5 text-lg text-text-secondary">{service.description}</p>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-5 font-display text-xl font-semibold">What&apos;s included</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {service.features?.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {service.technologies?.length > 0 && (
              <div>
                <h2 className="mb-5 font-display text-xl font-semibold">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span
                      key={tech._id}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-medium"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {service.process?.length > 0 && (
            <div className="mt-20">
              <h2 className="mb-8 font-display text-2xl font-semibold">Our process for this service</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {service.process.map((step) => (
                  <div key={step.step} className="glass-panel rounded-2xl p-6">
                    <span className="font-mono text-xs text-accent">
                      {String(step.step).padStart(2, '0')}
                    </span>
                    <h3 className="mb-2 mt-2 font-display text-base font-semibold">{step.title}</h3>
                    <p className="text-sm text-text-secondary">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      <CTASection
        title="Ready to talk about"
        highlight={service.title.toLowerCase() + '?'}
      />
    </>
  );
}
