import { useEffect, useRef, useState } from 'react';

/**
 * Tracks whether a ref'd element is currently intersecting the viewport.
 * Powers infinite scroll (attach to a sentinel div at the end of a list)
 * and can double as a generic "has this scrolled into view" hook.
 */
export function useIntersectionObserver({ root = null, rootMargin = '200px', threshold = 0 } = {}) {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { root, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold]);

  return [ref, isIntersecting];
}
