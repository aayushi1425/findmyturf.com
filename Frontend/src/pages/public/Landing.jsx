import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';

const Landing = () => (
    <div className="space-y-10">
        {/* Hero Section */}
        <section className="flex flex-col gap-6 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-500 px-6 py-12 text-white shadow-lg md:flex-row md:items-center md:justify-between">
            <div className="md:max-w-xl">
                <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                    Book top-quality sports turfs in minutes
                </h1>
                <p className="mt-3 text-lg text-emerald-50">
                    Search nearby turfs, check real-time slots, and reserve instantly.
                </p>
                <div className="mt-6 flex gap-4">
                    <Button as={Link} to="/turfs"  className="hover:scale-105 transition">
                        Browse Turfs
                    </Button>
                    <Button as={Link} to="/register" className="hover:scale-105 transition">
                        Get Started
                    </Button>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="grid gap-6 md:grid-cols-3">
            {[
                { title: 'Discover', desc: 'Filter by city, price, and distance.', color: 'emerald' },
                { title: 'Book', desc: 'See available slots and confirm quickly.', color: 'sky' },
                { title: 'Manage', desc: 'Owners manage turfs, courts, and bookings.', color: 'violet' },
            ].map((item) => (
                <div
                    key={item.title}
                    className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-lg hover:scale-105`}
                >
                    <div className={`mb-3 h-2 w-12 rounded-full bg-${item.color}-500`} />
                    <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
                </div>
            ))}
        </section>
    </div>
);

export default Landing;