import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ' +
    'transition-all duration-300 ease-premium focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground hover:opacity-90 shadow-glow',
        outline: 'border border-border bg-transparent hover:border-accent hover:text-accent',
        ghost: 'bg-transparent hover:bg-bg-surface',
        glass: 'glass-panel hover:border-accent',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
