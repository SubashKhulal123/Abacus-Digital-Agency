import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiClock } from 'react-icons/fi';
import Container from '@components/common/Container';
import SectionHeading from '@components/common/SectionHeading';
import Skeleton from '@components/common/Skeleton';
import CTAButton from '@components/common/CTAButton';
import ImageReveal from '@components/common/ImageReveal';
import { useBlogs } from '@hooks/useContent';

export default function BlogPreviewSection() {
  const { data, isLoading } = useBlogs({ limit: 3 });
  const posts = data?.data;

  return (
    <section id="blog" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="From the Blog"
          title="Notes from real"
          highlight="client work"
          description="Engineering and design write-ups grounded in what we actually shipped — not generic advice."
        />

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)
            : posts?.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} data-cursor-hover className="group block">
                    <ImageReveal
                      src={post.coverImage?.url}
                      alt={post.title}
                      className="aspect-[16/10] rounded-2xl"
                      imgClassName="transition-transform duration-700 group-hover:scale-105"
                    />
                    <p className="mb-2 mt-5 font-mono text-xs uppercase tracking-widest text-accent">
                      {post.category?.name}
                    </p>
                    <h3 className="font-display text-lg font-semibold leading-snug transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
                      <span className="inline-flex items-center gap-1">
                        <FiClock className="h-3 w-3" /> {post.readTimeMinutes} min read
                      </span>
                      <span className="inline-flex items-center gap-1 text-accent">
                        Read post <FiArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        <div className="mt-14 flex justify-center">
          <CTAButton to="/blog" variant="outline" size="lg">
            Read All Articles
          </CTAButton>
        </div>
      </Container>
    </section>
  );
}
