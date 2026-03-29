import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-white mb-8">Welcome Back</h2>
                {error && <p className="text-red-400 bg-red-400/10 p-3 rounded-lg mb-6 text-sm">{error}</p>}
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
                    <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
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
