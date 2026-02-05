import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import useAuth from '../../hooks/useAuth.js';

const Register = () => {
    const { register, loading, error } = useAuth();
    const [role, setRole] = useState('user');
    const [form, setForm] = useState({
        name: '',
        phone_no: '',
        password: '',
        business_name: '',
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form, role);
            navigate('/login');
        } catch {
            /* error shown */
        }
    };

    return (
        <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Create account</h1>
            <p className="text-sm text-slate-600">Choose a role and finish signup.</p>
            <div className="mt-3 flex gap-2">
                <Button
                    variant={role === 'user' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setRole('user')}
                >
                    User
                </Button>
                <Button
                    variant={role === 'owner' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setRole('owner')}
                >
                    Owner
                </Button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <Input
                    label="Name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <Input
                    label="Phone number"
                    placeholder="Enter phone number"
                    value={form.phone_no}
                    onChange={(e) => setForm({ ...form, phone_no: e.target.value })}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                />
                {role === 'owner' && (
                    <Input
                        label="Business name"
                        placeholder="Your turf brand"
                        value={form.business_name}
                        onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                        required
                    />
                )}
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating...' : 'Register'}
                </Button>
            </form>
        </div>
    );
};

export default Register;
