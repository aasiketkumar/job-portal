import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'seeker' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/');
        } catch (err) {
            setError('Registration failed. Try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-white mb-8">Create Account</h2>
                {error && <p className="text-red-400 bg-red-400/10 p-3 rounded-lg mb-6 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="text"
                                value={formData.name}
                                autoComplete="name" // added autocomplete for better UX
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="email"
                                value={formData.email}
                                autoComplete="email" // added autocomplete for better UX
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="password"
                                value={formData.password}
                                autoComplete="new-password" // added autocomplete for better UX
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="seeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>
                    <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        <UserPlus size={20} /> Register
                    </button>
                </form>
                <p className="mt-8 text-center text-slate-400">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
