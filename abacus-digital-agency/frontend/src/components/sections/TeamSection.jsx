import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiDribbble, FiGlobe } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import ImageReveal from '@components/common/ImageReveal';
import { useDevelopers } from '@hooks/useContent';

const SOCIAL_ICONS = { github: FiGithub, linkedin: FiLinkedin, dribbble: FiDribbble, portfolio: FiGlobe };

export default function TeamSection() {
  const { data: developers, isLoading, isError } = useDevelopers({ featured: 'true', limit: 8 });

  return (
    <section id="team" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Our Team"
          title="The people behind"
          highlight="the work"
          description="A small, senior team — every project is staffed by people who've shipped this exact kind of work before."
        />

        {isError && <ErrorState message="We couldn't load our team right now." />}

        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />)
            : developers?.map((dev, i) => (
                <motion.div
                  key={dev._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl"
                >
                  <ImageReveal
                    src={dev.avatar?.url}
                    alt={dev.name}
                    className="aspect-[3/4]"
                    imgClassName="transition-transform duration-700 ease-premium group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-14">
                    <h3 className="font-display text-base font-semibold text-white">{dev.name}</h3>
                    <p className="mb-2 text-xs text-white/70">{dev.designation}</p>
                    <div className="flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {Object.entries(dev.socialLinks || {}).map(([key, url]) => {
                        const Icon = SOCIAL_ICONS[key];
                        if (!Icon || !url) return null;
                        return (
                          <a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            data-cursor-hover
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-accent"
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </Container>
    </section>
  );
}
