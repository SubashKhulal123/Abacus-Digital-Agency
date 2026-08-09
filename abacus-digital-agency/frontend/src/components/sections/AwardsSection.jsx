import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import { useSiteSettings } from '@hooks/useContent';
import { getIcon } from '@utils/getIcon';

export default function AwardsSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const awards = settings?.awards || [];

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Recognition" title="Awards &" highlight="acknowledgments" />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
            : awards.map((award, i) => {
                const Icon = getIcon(award.icon);
                return (
                  <motion.div
                    key={award.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-border p-7 text-center transition-colors hover:border-accent/40"
                  >
                    <Icon className="h-7 w-7 text-accent" />
                    <h3 className="font-display text-sm font-semibold leading-snug">{award.title}</h3>
                    <p className="text-xs text-text-muted">
                      {award.organization} · {award.year}
                    </p>
                  </motion.div>
                );
              })}
        </div>
      </Container>
    </section>
  );
}
