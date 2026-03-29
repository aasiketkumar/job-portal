import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            // Error is handled in AuthContext
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 pt-24 md:pt-0">
            <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl mb-4 border border-blue-500/20">
                        <LogIn className="text-blue-500" size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Welcome Back</h2>
                    <p className="text-slate-400 mt-2">Login to manage your job career</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email" // added autocomplete for better UX
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password" // added autocomplete for better UX
                                className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                        <LogIn size={20} /> Login
                    </button>
                </form>
                <p className="mt-8 text-center text-slate-400">
                    New here? <Link to="/register" className="text-blue-400 hover:underline">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
