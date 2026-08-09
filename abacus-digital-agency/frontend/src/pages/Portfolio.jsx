import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import PageHero from '@components/common/PageHero';
import Container from '@components/common/Container';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import EmptyState from '@components/common/EmptyState';
import ImageReveal from '@components/common/ImageReveal';
import SEO from '@components/common/SEO';
import CTASection from '@components/sections/CTASection';
import { useProjects, useCategories } from '@hooks/useContent';
import { cn } from '@lib/utils';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: categories } = useCategories('project');
  const { data, isLoading, isError } = useProjects(
    activeCategory === 'all' ? {} : { category: activeCategory }
  );
  const projects = data?.data;

  return (
    <>
      <SEO
        title="Portfolio"
        description="Case studies from real production launches across healthcare, fintech, logistics, retail, and more."
        url="/portfolio"
      />
      <PageHero
        eyebrow="Our Work"
        title="Case studies from"
        highlight="real launches"
        description="Every project here shipped to production and moved a real business metric."
      />

      <section className="pb-24">
        <Container>
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                activeCategory === 'all'
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border text-text-secondary hover:border-accent/40'
              )}
            >
              All Work
            </button>
            {categories?.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  activeCategory === cat._id
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-border text-text-secondary hover:border-accent/40'
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {isError && <ErrorState message="We couldn't load our portfolio right now." />}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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

          {!isLoading && projects?.length === 0 && (
            <EmptyState message="No projects in this category yet." />
          )}
        </Container>
      </section>

      <CTASection />
    </>
  );
}
