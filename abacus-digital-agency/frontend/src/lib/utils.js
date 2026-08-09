import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names intelligently, resolving conflicts
 * (e.g. "px-2" vs "px-4") in favor of the last one specified.
 * Standard shadcn/ui utility.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
