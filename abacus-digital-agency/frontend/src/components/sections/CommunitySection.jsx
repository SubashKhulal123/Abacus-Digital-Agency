import { motion } from 'framer-motion';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import { useSiteSettings } from '@hooks/useContent';
import { getIcon } from '@utils/getIcon';

export default function CommunitySection() {
  const { data: settings, isLoading } = useSiteSettings();
  const community = settings?.community;

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="glass-panel mx-auto max-w-4xl rounded-3xl p-10 text-center sm:p-14">
          <SectionHeading
            eyebrow="Community"
            title={community?.title || 'Community'}
            description={community?.description}
            className="mx-0 max-w-none"
          />
          {isLoading ? (
            <div className="mt-8 flex justify-center gap-4">
              <Skeleton className="h-11 w-32 rounded-full" />
              <Skeleton className="h-11 w-32 rounded-full" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              {community?.links?.map((link) => {
                const Icon = getIcon(link.icon);
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    data-cursor-hover
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </a>
                );
              })}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}
