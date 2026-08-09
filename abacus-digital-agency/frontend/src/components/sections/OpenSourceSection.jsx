import { motion } from 'framer-motion';
import { FiGithub, FiStar } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import { useSiteSettings } from '@hooks/useContent';

export default function OpenSourceSection() {
  const { data: settings, isLoading } = useSiteSettings();
  const openSource = settings?.openSource;

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Open Source"
          title={openSource?.title || 'Open Source'}
          description={openSource?.description}
        />

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
            : openSource?.repositories?.map((repo, i) => (
                <motion.a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor-hover
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group flex flex-col rounded-2xl border border-border p-6 transition-colors hover:border-accent/40"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <FiGithub className="h-5 w-5 text-text-secondary" />
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                      <FiStar className="h-3 w-3" /> {repo.stars}
                    </span>
                  </div>
                  <h3 className="mb-1.5 font-mono text-sm font-semibold transition-colors group-hover:text-accent">
                    {repo.name}
                  </h3>
                  <p className="mb-3 flex-1 text-xs leading-relaxed text-text-secondary">
                    {repo.description}
                  </p>
                  <span className="text-xs text-text-muted">{repo.language}</span>
                </motion.a>
              ))}
        </div>
      </Container>
    </section>
  );
}
