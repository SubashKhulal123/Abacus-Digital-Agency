import { useState, useCallback } from 'react';

/**
 * localStorage-backed state, safe for SSR/non-browser contexts and
 * resilient to malformed stored JSON (falls back to the initial value).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (_) {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      setValue((prev) => {
        const resolved = newValue instanceof Function ? newValue(prev) : newValue;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch (_) {
          // storage full or unavailable — fail silently, state still updates in-memory
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setStoredValue];
}
