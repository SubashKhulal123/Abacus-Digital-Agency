import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiClock } from 'react-icons/fi';
import PageHero from '@components/common/PageHero';
import Container from '@components/common/Container';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import EmptyState from '@components/common/EmptyState';
import ImageReveal from '@components/common/ImageReveal';
import SEO from '@components/common/SEO';
import NewsletterSection from '@components/sections/NewsletterSection';
import { useInfiniteBlogs, useCategories } from '@hooks/useContent';
import { useIntersectionObserver } from '@hooks/useIntersectionObserver';
import { cn } from '@lib/utils';

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { data: categories } = useCategories('blog');

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteBlogs(activeCategory !== 'all' ? { category: activeCategory } : {});

  const posts = data?.pages.flatMap((page) => page.data) || [];

  // Infinite scroll: fetch the next page automatically once the sentinel
  // div scrolls into view, ~400px before it's actually reached.
  const [sentinelRef, isSentinelVisible] = useIntersectionObserver({ rootMargin: '400px' });
  if (isSentinelVisible && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  return (
    <>
      <SEO
        title="Blog"
        description="Engineering and design write-ups grounded in real client work — not generic advice."
        url="/blog"
      />
      <PageHero
        eyebrow="Blog"
        title="Notes from"
        highlight="real client work"
        description="Engineering and design write-ups grounded in what we actually shipped."
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
              All Posts
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

          {isError && <ErrorState message="We couldn't load blog posts right now." />}

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full rounded-2xl" />
                ))
              : posts.map((post, i) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
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
                      <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{post.excerpt}</p>
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

          {!isLoading && posts.length === 0 && <EmptyState message="No posts in this category yet." />}

          {/* Infinite scroll sentinel + loading indicator */}
          <div ref={sentinelRef} className="mt-14 flex justify-center">
            {isFetchingNextPage && (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
            )}
            {!hasNextPage && posts.length > 0 && (
              <p className="text-xs text-text-muted">You&apos;ve reached the end — that&apos;s every post.</p>
            )}
          </div>
        </Container>
      </section>

      <NewsletterSection />
    </>
  );
}
