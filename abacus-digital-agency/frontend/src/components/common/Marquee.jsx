import { Children, cloneElement } from 'react';
import { useMediaQuery } from '@hooks/useMediaQuery';
import { cn } from '@lib/utils';

/**
 * Infinite horizontal marquee.
 *
 * Both copies of the content live inside ONE animated flex container
 * (not two separately-animated containers — that was an earlier bug:
 * two independent strips can't slide as a single continuous belt).
 * With everything in one container, the CSS "marquee" keyframe
 * (translateX(-50%)) always moves exactly one full content-width to
 * the left, seamless regardless of item count.
 *
 * Reduced-motion handling: the app's global CSS forces every animation's
 * duration to ~0 for visitors with "reduce motion" enabled at the OS
 * level (styles/index.css). That's correct for stopping the *looping*
 * motion, but naively applied to a two-copies-of-the-content marquee it
 * just freezes both copies visible at once, which reads as duplicated
 * logos rather than a clean list. So when reduced motion is detected,
 * this component switches layout entirely: a single, non-duplicated,
 * wrapped static row — no animation, no second copy, nothing to freeze
 * mid-state.
 */
export default function Marquee({ children, className, reverse = false, speed = 'normal' }) {
  const durationMap = { slow: '45s', normal: '28s', fast: '16s' };
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion) {
    return (
      <div className={cn('flex flex-wrap items-center justify-center gap-x-12 gap-y-6', className)}>
        {children}
      </div>
    );
  }

  const duplicate = Children.map(children, (child, i) =>
    cloneElement(child, { key: `marquee-dup-${child.key ?? i}` })
  );

  return (
    <div className={cn('group relative flex overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max shrink-0 animate-marquee items-center gap-12',
          reverse && '[animation-direction:reverse]'
        )}
        style={{ animationDuration: durationMap[speed] }}
      >
        {children}
        {duplicate}
      </div>
    </div>
  );
}