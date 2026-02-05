import React from 'react';

const Spinner = ({ size = 6, colorFrom = 'indigo-500', colorTo = 'purple-500', className = '', ...props }) => {
    const sizeClass = `w-${size} h-${size}`;
    return (
        <svg
            className={`animate-spin ${sizeClass} ${className}`}
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={`var(--tw-gradient-from, theme(colors.${colorFrom}))`} />
                    <stop offset="100%" stopColor={`var(--tw-gradient-to, theme(colors.${colorTo}))`} />
                </linearGradient>
            </defs>
            <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                className="opacity-25"
            />
            <path
                fill="none"
                stroke="url(#grad)"
                strokeWidth="5"
                strokeLinecap="round"
                d="M25 5
           a20 20 0 0 1 0 40
           a20 20 0 0 1 0 -40"
            />
        </svg>
    );
};

export default Spinner;