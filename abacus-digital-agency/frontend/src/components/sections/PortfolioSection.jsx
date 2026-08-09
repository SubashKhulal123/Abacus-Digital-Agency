import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import CTAButton from '@components/common/CTAButton';
import ImageReveal from '@components/common/ImageReveal';
import { useProjects } from '@hooks/useContent';

export default function PortfolioSection() {
  const { data, isLoading, isError } = useProjects({ featured: 'true', limit: 4 });
  const projects = data?.data;

  return (
    <section id="portfolio" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Selected Work"
          title="Case studies from"
          highlight="real production launches"
          description="Every project below shipped to real users — not concept work sitting in a portfolio."
        />

        {isError && <ErrorState message="We couldn't load our portfolio right now." />}

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-full rounded-2xl" />
              ))
            : projects?.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: (i % 2) * 0.1 }}
                >
                  <Link to={`/portfolio/${project.slug}`} data-cursor-hover className="group block">
                    <ImageReveal
                      src={project.thumbnail?.url}
                      alt={project.title}
                      className="aspect-[4/3] rounded-2xl"
                      imgClassName="transition-transform duration-700 ease-premium group-hover:scale-105"
                    />
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent">
                          {project.category?.name}
                        </p>
                        <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-accent">
                          {project.title}
                        </h3>
                        <p className="mt-1.5 max-w-md text-sm text-text-secondary">
                          {project.shortDescription}
                        </p>
                      </div>
                      <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                        <FiArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        <div className="mt-14 flex justify-center">
          <CTAButton to="/portfolio" variant="outline" size="lg">
            View Full Portfolio
          </CTAButton>
        </div>
      </Container>
    </section>
  );
}
