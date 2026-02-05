import React from 'react';
import clsx from 'clsx';

const variants = {
  primary:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-300',
  secondary:
    'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
};

const sizes = {
  md: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-5 py-3 text-base rounded-lg',
  sm: 'px-3 py-1.5 text-xs rounded-md',
};

const Button = React.forwardRef(
  ({ children, as: Component = 'button', variant = 'primary', size = 'md', className = '', ...props }, ref) => (
    <Component
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
);

Button.displayName = 'Button';

export default Button;
