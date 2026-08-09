import { cn } from '@lib/utils';

/**
 * Consistent max-width content wrapper used across every section.
 * Scales gracefully from mobile up through ultra-wide monitors via
 * the container config in tailwind.config.js.
 */
export default function Container({ children, className, as: Tag = 'div' }) {
  return <Tag className={cn('container', className)}>{children}</Tag>;
}
