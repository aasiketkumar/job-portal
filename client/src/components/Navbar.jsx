import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-800 z-50 px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-100">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2 text-blue-500">
                    <Briefcase /> Job Portal
                </Link>
                <div className="flex items-center gap-6">
                    <Link to="/" className="hover:text-blue-400 transition">Jobs</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                            <Link to="/profile" className="hover:text-blue-400 transition">Profile</Link>
                            {user.role === 'employer' && (
                                <Link to="/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                    Post a Job
                                </Link>
                            )}
                            <span className="text-slate-400 ml-4">Welcome, <span className="text-white font-medium">{user.name}</span></span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition ml-2"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
