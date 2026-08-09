import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import { useSiteSettings } from '@hooks/useContent';
import { getIcon } from '@utils/getIcon';

export default function WhyChooseUsSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const items = settings?.whyChooseUs || [];

  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Why Choose Us"
              title="Agency craft,"
              highlight="product-team rigor"
              align="left"
              className="mx-0 max-w-none text-left"
            />
            <p className="mt-5 max-w-sm text-text-secondary">
              We combine the polish clients expect from a top-tier studio with the engineering
              discipline they&apos;d expect from an in-house product team.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)
              : items.map((item, i) => {
                  const Icon = getIcon(item.icon);
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      className="flex items-start gap-4 rounded-2xl border border-border p-6 transition-colors hover:border-accent/40"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="mb-1.5 font-display text-base font-semibold">{item.title}</h3>
                        <p className="text-sm leading-relaxed text-text-secondary">{item.description}</p>
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
