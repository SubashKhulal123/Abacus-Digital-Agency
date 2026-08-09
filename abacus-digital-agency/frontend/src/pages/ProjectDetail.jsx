import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';
import Container from '@components/common/Container';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import ImageReveal from '@components/common/ImageReveal';
import SEO, { buildBreadcrumbSchema } from '@components/common/SEO';
import CTASection from '@components/sections/CTASection';
import { useProject } from '@hooks/useContent';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, isLoading, isError } = useProject(slug);

  if (isLoading) {
    return (
      <Container className="pb-24 pt-40">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-8 h-96 w-full rounded-2xl" />
      </Container>
    );
  }

  if (isError || !project) {
    return (
      <Container className="pb-24 pt-40">
        <ErrorState message="We couldn't find that project." />
      </Container>
    );
  }

  return (
    <>
      <SEO
        title={project.title}
        description={project.shortDescription}
        image={project.thumbnail?.url}
        url={`/portfolio/${project.slug}`}
        type="article"
        structuredData={buildBreadcrumbSchema([
          { label: 'Home', path: '/' },
          { label: 'Portfolio', path: '/portfolio' },
          { label: project.title, path: `/portfolio/${project.slug}` },
        ])}
      />
      <section className="pb-16 pt-40 sm:pt-48">
        <Container>
          <Link
            to="/portfolio"
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <FiArrowLeft className="h-4 w-4" /> All Projects
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
                {project.category?.name} · {project.client?.name}
              </p>
              <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-text-secondary">{project.shortDescription}</p>
            </div>
            <div className="flex shrink-0 gap-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground"
                >
                  Visit Live Site <FiExternalLink className="h-4 w-4" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium"
                >
                  <FiGithub className="h-4 w-4" /> Code
                </a>
              )}
            </div>
          </motion.div>

          <ImageReveal
            src={project.thumbnail?.url}
            alt={project.title}
            className="mt-12 aspect-[16/9] rounded-2xl"
          />

          {project.results?.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-6 border-y border-border-subtle py-10 sm:grid-cols-3">
              {project.results.map((r) => (
                <div key={r.metric} className="text-center">
                  <p className="font-display text-3xl font-semibold text-accent">{r.value}</p>
                  <p className="mt-1 text-xs text-text-muted">{r.metric}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <div>
                <h2 className="mb-3 font-display text-xl font-semibold">Overview</h2>
                <p className="leading-relaxed text-text-secondary">{project.description}</p>
              </div>
              {project.challenges && (
                <div>
                  <h2 className="mb-3 font-display text-xl font-semibold">The Challenge</h2>
                  <p className="leading-relaxed text-text-secondary">{project.challenges}</p>
                </div>
              )}
              {project.solutions && (
                <div>
                  <h2 className="mb-3 font-display text-xl font-semibold">Our Solution</h2>
                  <p className="leading-relaxed text-text-secondary">{project.solutions}</p>
                </div>
              )}
              {project.features?.length > 0 && (
                <div>
                  <h2 className="mb-3 font-display text-xl font-semibold">Key Features</h2>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {project.features.map((f) => (
                      <li key={f} className="text-sm text-text-secondary">— {f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="space-y-8">
              <div>
                <p className="mb-3 text-xs uppercase tracking-widest text-text-muted">Client</p>
                <p className="text-sm font-medium">{project.client?.name}</p>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-widest text-text-muted">Duration</p>
                <p className="text-sm font-medium">{project.durationWeeks} weeks</p>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-widest text-text-muted">Team Size</p>
                <p className="text-sm font-medium">{project.teamSize} people</p>
              </div>
              {project.technologies?.length > 0 && (
                <div>
                  <p className="mb-3 text-xs uppercase tracking-widest text-text-muted">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span key={t._id} className="rounded-full border border-border px-3 py-1 text-xs">
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.developers?.length > 0 && (
                <div>
                  <p className="mb-3 text-xs uppercase tracking-widest text-text-muted">Team</p>
                  <div className="space-y-2">
                    {project.developers.map((d) => (
                      <div key={d._id} className="flex items-center gap-2.5">
                        <img src={d.avatar?.url} alt={d.name} className="h-7 w-7 rounded-full object-cover" />
                        <span className="text-sm">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {project.gallery?.length > 0 && (
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {project.gallery.map((img, i) => (
                <ImageReveal
                  key={img.publicId || i}
                  src={img.url}
                  alt={img.caption || project.title}
                  className="aspect-video rounded-2xl"
                  delay={i * 0.1}
                />
              ))}
            </div>
          )}
        </Container>
      </section>

      <CTASection eyebrow="Like What You See" title="Let's build" highlight="something similar." />
    </>
  );
}
