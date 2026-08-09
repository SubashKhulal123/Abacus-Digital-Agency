import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import { useSiteSettings } from '@hooks/useContent';
import { getIcon } from '@utils/getIcon';

export default function IndustriesSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const industries = settings?.industries || [];

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Industries"
          title="Domain experience that"
          highlight="shortens the learning curve"
          description="We've navigated the real constraints of these industries before — compliance, scale, and trust requirements included."
        />

        <div className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)
            : industries.map((ind, i) => {
                const Icon = getIcon(ind.icon);
                return (
                  <motion.div
                    key={ind.name}
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-bg-surface/30 p-6 text-center transition-colors hover:border-accent/40"
                  >
                    <Icon className="h-6 w-6 text-accent" />
                    <span className="text-sm font-medium">{ind.name}</span>
                  </motion.div>
                );
              })}
        </div>
      </Container>
    </section>
  );
}
