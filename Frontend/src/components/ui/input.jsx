import React from 'react';
import clsx from 'clsx';

const Input = React.forwardRef(({ className = '', label, as: Component = 'input', ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm text-slate-700">
    {label && <span className="font-medium">{label}</span>}
    <Component
      ref={ref}
      className={clsx(
        'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100',
        className
      )}
      {...props}
    />
  </label>
));

Input.displayName = 'Input';

export default Input;
