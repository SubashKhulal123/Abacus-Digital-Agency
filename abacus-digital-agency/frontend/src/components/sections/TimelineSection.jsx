import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import { useSiteSettings } from '@hooks/useContent';

export default function TimelineSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const timeline = settings?.timeline || [];

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Our Journey" title="A brief" highlight="history" />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="absolute left-[27px] top-2 h-[calc(100%-16px)] w-px bg-border sm:left-1/2" />
          <div className="space-y-10">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)
              : timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.06 }}
                    className="relative flex gap-6 sm:justify-center"
                  >
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-accent bg-bg font-mono text-xs font-semibold text-accent sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                      {item.year}
                    </div>
                    <div
                      className={`glass-panel mt-1 w-full rounded-2xl p-6 sm:w-[calc(50%-3rem)] ${
                        i % 2 === 0 ? 'sm:mr-auto sm:text-right' : 'sm:ml-auto'
                      }`}
                    >
                      <h3 className="mb-1.5 font-display text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-text-secondary">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
