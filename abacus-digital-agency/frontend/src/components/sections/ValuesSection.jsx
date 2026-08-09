import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import { useSiteSettings } from '@hooks/useContent';
import { getIcon } from '@utils/getIcon';

export default function ValuesSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const values = settings?.values || [];

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Our Values"
          title="What guides"
          highlight="every decision"
          description="Principles we hold to whether a project is going smoothly or under real pressure."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-2xl" />)
            : values.map((value, i) => {
                const Icon = getIcon(value.icon);
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-bg-surface/40 p-7 transition-colors duration-300 hover:border-accent/40"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-semibold">{value.title}</h3>
                    <p className="text-sm leading-relaxed text-text-secondary">{value.description}</p>
                  </motion.div>
                );
              })}
        </div>
      </Container>
    </section>
  );
}
