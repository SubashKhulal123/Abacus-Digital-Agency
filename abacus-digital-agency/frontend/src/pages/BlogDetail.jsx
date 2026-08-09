import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiHeart, FiEye } from 'react-icons/fi';
import Container from '@components/common/Container';
import Skeleton from '@components/common/Skeleton';
import ErrorState from '@components/common/ErrorState';
import SEO, { buildArticleSchema } from '@components/common/SEO';
import ScrollProgress from '@components/common/ScrollProgress';
import CTASection from '@components/sections/CTASection';
import { useBlog, useLikeBlog } from '@hooks/useContent';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: post, isLoading, isError } = useBlog(slug);
  const likeMutation = useLikeBlog();
  const [localLikes, setLocalLikes] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);

  if (post && localLikes === null) {
    setLocalLikes(post.likes);
  }

  const handleLike = async () => {
    if (hasLiked || !post) return;
    setHasLiked(true);
    setLocalLikes((prev) => (prev ?? 0) + 1);
    try {
      await likeMutation.mutateAsync(post._id);
    } catch (error) {
      setLocalLikes((prev) => (prev ?? 1) - 1);
      setHasLiked(false);
    }
  };

  if (isLoading) {
    return (
      <Container className="pb-24 pt-40">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-8 h-80 w-full rounded-2xl" />
      </Container>
    );
  }

  if (isError || !post) {
    return (
      <Container className="pb-24 pt-40">
        <ErrorState message="We couldn't find that post." />
      </Container>
    );
  }

  return (
    <>
      <ScrollProgress />
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.coverImage?.url}
        url={`/blog/${post.slug}`}
        type="article"
        structuredData={buildArticleSchema(post)}
      />
      <article className="pb-24 pt-40 sm:pt-48">
        <Container className="max-w-3xl">
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <FiArrowLeft className="h-4 w-4" /> All Posts
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
              {post.category?.name}
            </p>
            <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-border-subtle py-5 text-sm text-text-muted">
              <div className="flex items-center gap-2.5">
                {post.author?.avatar?.url && (
                  <img
                    src={post.author.avatar.url}
                    alt={post.author.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <span className="font-medium text-text">{post.author?.name || 'Abacus Team'}</span>
              </div>
              <span className="inline-flex items-center gap-1.5">
                <FiClock className="h-3.5 w-3.5" /> {post.readTimeMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FiEye className="h-3.5 w-3.5" /> {post.views} views
              </span>
              <button
                onClick={handleLike}
                disabled={hasLiked}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 transition-colors hover:border-accent hover:text-accent disabled:text-accent"
              >
                <FiHeart className={hasLiked ? 'h-3.5 w-3.5 fill-accent' : 'h-3.5 w-3.5'} />
                {localLikes}
              </button>
            </div>

            {post.coverImage?.url && (
              <img
                src={post.coverImage.url}
                alt={post.title}
                className="mt-10 aspect-video w-full rounded-2xl object-cover"
              />
            )}

            {/*
              Blog content is authored HTML from the trusted admin CMS
              (not user-submitted input), so rendering it directly is safe
              here — this is the standard pattern for rich-text CMS content.
            */}
            <div
              className="prose prose-invert mt-10 max-w-none text-text-secondary prose-headings:font-display prose-headings:text-text prose-a:text-accent"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.tags?.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-border-subtle pt-8">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </Container>
      </article>

      <CTASection />
    </>
  );
}
