import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import CTAButton from '@components/common/CTAButton';
import { useSiteSettings } from '@hooks/useContent';
import { cn } from '@lib/utils';

export default function PricingSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const plans = settings?.pricingPlans || [];

  return (
    <section id="pricing" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Straightforward"
          highlight="engagement models"
          description="Every quote is scoped to your actual project — these are starting points, not rigid packages."
        />

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[480px] w-full rounded-2xl" />)
            : plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={cn(
                    'relative flex flex-col rounded-2xl border p-8',
                    plan.isPopular
                      ? 'border-accent bg-bg-surface shadow-glow-lg'
                      : 'border-border bg-bg-surface/30'
                  )}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold text-accent-foreground">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-sm text-text-secondary">{plan.description}</p>

                  <div className="my-8">
                    {plan.price ? (
                      <p className="font-display text-4xl font-semibold">
                        ${plan.price.toLocaleString()}
                        <span className="ml-1 text-sm font-normal text-text-muted">
                          {plan.billingNote}
                        </span>
                      </p>
                    ) : (
                      <p className="font-display text-4xl font-semibold">{plan.billingNote}</p>
                    )}
                  </div>

                  <ul className="mb-8 flex-1 space-y-3">
                    {plan.features?.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <FiCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <CTAButton
                    to="/contact"
                    variant={plan.isPopular ? 'default' : 'outline'}
                    className="w-full justify-center"
                  >
                    {plan.ctaLabel}
                  </CTAButton>
                </motion.div>
              ))}
        </div>
      </Container>
    </section>
  );
}
