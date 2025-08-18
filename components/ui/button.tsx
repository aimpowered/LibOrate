import { Button as HeadlessButton } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  selected?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ selected, className, children, ...props }, ref) => {
    return (
      <HeadlessButton
        ref={ref}
        className={clsx(
          'bg-transparent text-black border border-gray-300 rounded-full cursor-pointer m-1 text-xl shadow-[0_2px_1px_white] hover:bg-muted',
          {
            'bg-destructive text-destructive-foreground font-bold': selected,
          },
          className
        )}
        {...props}
      >
        {children}
      </HeadlessButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
