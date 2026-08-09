import { useState } from 'react';
import Skeleton from './Skeleton';
import { optimizeImageUrl, buildSrcSet } from '@utils/imageOptimization';
import { cn } from '@lib/utils';

/**
 * Drop-in replacement for <img> that: lazy-loads via the native
 * `loading="lazy"` attribute, shows a skeleton placeholder until the
 * image actually loads (no layout shift, no flash of broken image), and
 * automatically applies Cloudinary format/quality/width optimization.
 */
export default function LazyImage({
  src,
  alt,
  className,
  width,
  responsive = false,
  priority = false,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const optimizedSrc = optimizeImageUrl(src, { width });
  const srcSet = responsive ? buildSrcSet(src) : undefined;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!loaded && <Skeleton className="absolute inset-0" />}
      <img
        src={optimizedSrc}
        srcSet={srcSet}
        sizes={responsive ? '(max-width: 768px) 100vw, 50vw' : undefined}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  );
}
