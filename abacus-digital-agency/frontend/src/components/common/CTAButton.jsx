import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import MagneticButton from './MagneticButton';
import { Button } from '@components/ui/button';
import { cn } from '@lib/utils';

/**
 * The site's primary call-to-action button pattern: magnetic hover +
 * an arrow icon that shifts on hover. Renders a <Link> when `to` is
 * given, otherwise a plain <button> (e.g. for form submits).
 */
const CTAButton = forwardRef(
  ({ children, to, href, onClick, variant = 'default', size = 'default', className, type = 'button', ...props }, ref) => {
    const content = (
      <span className="group inline-flex items-center gap-2">
        {children}
        <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    );

    const inner = to ? (
      <Button asChild variant={variant} size={size} className={cn(className)} ref={ref} {...props}>
        <Link to={to}>{content}</Link>
      </Button>
    ) : href ? (
      <Button asChild variant={variant} size={size} className={cn(className)} ref={ref} {...props}>
        <a href={href} target="_blank" rel="noreferrer">
          {content}
        </a>
      </Button>
    ) : (
      <Button
        type={type}
        variant={variant}
        size={size}
        onClick={onClick}
        className={cn(className)}
        ref={ref}
        {...props}
      >
        {content}
      </Button>
    );

    return <MagneticButton>{inner}</MagneticButton>;
  }
);
CTAButton.displayName = 'CTAButton';

export default CTAButton;
