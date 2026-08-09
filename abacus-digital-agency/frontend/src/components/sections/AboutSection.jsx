import { motion } from 'framer-motion';
import { FiTarget, FiEye } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import { useSiteSettings } from '@hooks/useContent';

export default function AboutSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const about = settings?.aboutContent;

  return (
    <section id="about" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Our Story"
          title="Built by people who've"
          highlight="shipped real products"
          description="Not just another studio with a portfolio of pretty mockups — a team that owns outcomes from first sketch to production."
        />

        <div className="mx-auto mt-16 max-w-3xl">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="text-balance text-center text-lg leading-relaxed text-text-secondary"
            >
              {about?.story}
            </motion.p>
          )}
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
          {[
            { icon: FiTarget, label: 'Mission', text: about?.mission },
            { icon: FiEye, label: 'Vision', text: about?.vision },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-8"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold">{item.label}</h3>
              {isLoading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <p className="text-sm leading-relaxed text-text-secondary">{item.text}</p>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
