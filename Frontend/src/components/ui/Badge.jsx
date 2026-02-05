import React from 'react';
import clsx from 'clsx';

const colors = {
  gray: 'bg-slate-100 text-slate-800',
  green: 'bg-emerald-100 text-emerald-800',
  blue: 'bg-sky-100 text-sky-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-rose-100 text-rose-800',
};

const Badge = ({ children, color = 'gray', className = '' }) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
      colors[color],
      className
    )}
  >
    {children}
  </span>
);

export default Badge;
