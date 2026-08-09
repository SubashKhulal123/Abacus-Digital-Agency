import { useEffect } from 'react';

/**
 * Calls `handler` when a click/touch occurs outside the referenced
 * element. Every dropdown/popover in the app (theme switcher, profile
 * menu, notifications) can consolidate its outside-click logic onto this.
 */
export function useClickOutside(ref, handler, isActive = true) {
  useEffect(() => {
    if (!isActive) return undefined;

    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, isActive]);
}
