import { useEffect, useState } from 'react';

/**
 * Reactive CSS media query hook, e.g. useMediaQuery('(min-width: 1024px)').
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mediaQueryList.addEventListener('change', handler);
    setMatches(mediaQueryList.matches);
    return () => mediaQueryList.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
