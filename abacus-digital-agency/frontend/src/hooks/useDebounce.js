import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay`ms
 * of no further changes. Used for search inputs so we don't fire an API
 * request on every keystroke.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
