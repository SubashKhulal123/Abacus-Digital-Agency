import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import { useSiteSettings } from '@hooks/useContent';
import { getIcon } from '@utils/getIcon';

export default function ProcessSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const steps = settings?.processSteps || [];

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="How We Work"
          title="A process built for"
          highlight="predictable outcomes"
          description="No black-box phases — you can see and review progress at every stage."
        />

        <div className="relative mt-20">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-border lg:left-1/2 lg:block" />
          <div className="space-y-10 lg:space-y-16">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
              : steps.map((step, i) => {
                  const Icon = getIcon(step.icon);
                  const isEven = i % 2 === 0;
                  return (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.6 }}
                      className={`relative flex items-start gap-6 lg:w-1/2 ${
                        isEven ? 'lg:pr-12' : 'lg:ml-auto lg:pl-12'
                      }`}
                    >
                      <div className="absolute -left-[1px] top-1 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-bg lg:block lg:left-auto lg:right-0 lg:translate-x-1/2 lg:[&:not(:first-child)]:block" />
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 font-mono text-sm font-semibold text-accent lg:hidden">
                        {String(step.step).padStart(2, '0')}
                      </div>
                      <div className="glass-panel w-full rounded-2xl p-6">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-mono text-xs text-text-muted">
                            Step {String(step.step).padStart(2, '0')}
                          </span>
                        </div>
                        <h3 className="mb-2 font-display text-lg font-semibold">{step.title}</h3>
                        <p className="text-sm leading-relaxed text-text-secondary">{step.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </Container>
    </section>
  );
}
