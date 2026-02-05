import React from 'react';

const Footer = () => (
    <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between px-4 py-4 text-xs text-slate-600">
            <span className="mb-2 sm:mb-0">
                © {new Date().getFullYear()} <strong className="font-semibold text-slate-800">FindMyTurf</strong>
            </span>
            <span className="flex items-center gap-4">
                <span>Play more. Stress less.</span>
            </span>
        </div>
    </footer>
);

export default Footer;