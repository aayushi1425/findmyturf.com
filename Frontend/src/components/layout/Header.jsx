import Button from '../ui/Button.jsx';
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth.js';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const { isAuthenticated, role, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Explore', path: '/turfs' },
        ...(isAuthenticated && role === 'OWNER'
            ? [
                { name: 'Dashboard', path: '/owner/dashboard' },
                { name: 'My Turfs', path: '/owner/turfs' },
            ]
            : []),
        ...(isAuthenticated ? [{ name: 'My Bookings', path: '/user/bookings' }] : []),
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link to="/" className="text-lg font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                    FindMyTurf
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-4 text-sm text-slate-700">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`hover:text-emerald-700 transition-colors ${location.pathname === link.path ? 'font-semibold text-emerald-700' : ''
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Buttons */}
                <div className="hidden md:flex items-center gap-2">
                    {!isAuthenticated ? (
                        <>
                            <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                            <Button size="sm" onClick={() => navigate('/register')}>
                                Sign up
                            </Button>
                        </>
                    ) : (
                        <Button variant="secondary" size="sm" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 text-slate-700 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
                    >
                        {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {menuOpen && (
                <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMenuOpen(false)}
                            className={`block text-sm px-2 py-1 rounded hover:bg-slate-100 transition ${location.pathname === link.path ? 'font-semibold text-emerald-700' : 'text-slate-700'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-2 border-t border-slate-200">
                        {!isAuthenticated ? (
                            <div className="flex flex-col gap-2">
                                <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
                                    Login
                                </Button>
                                <Button size="sm" onClick={() => navigate('/register')}>
                                    Sign up
                                </Button>
                            </div>
                        ) : (
                            <Button variant="secondary" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;