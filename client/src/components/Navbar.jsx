import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, LogIn, UserPlus, LayoutDashboard, User, Menu, X, Search } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 px-4 md:px-8 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-100">
                <div className="flex items-center gap-12">
                    <Link to="/" onClick={closeMenu} className="text-xl md:text-2xl font-bold flex items-center gap-2 text-blue-500 hover:text-blue-400 transition">
                        <Briefcase className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="hidden xs:block">Job Portal</span>
                    </Link>

                    {/* Desktop Menu - Grouped with Logo */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 hover:text-blue-400 transition hover:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                            <Search size={18} /> Jobs
                        </Link>
                        {user && (
                            <>
                                <Link to="/dashboard" className="flex items-center gap-2 hover:text-blue-400 transition hover:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                    <LayoutDashboard size={18} /> Dashboard
                                </Link>
                                <Link to="/profile" className="flex items-center gap-2 hover:text-blue-400 transition hover:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                    <User size={18} /> Profile
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Desktop Right Side - User Info & Auth */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            {user.role === 'employer' && (
                                <Link to="/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
                                    <Briefcase size={18} /> Post a Job
                                </Link>
                            )}
                            <div className="flex items-center gap-4 pl-6 border-l border-slate-700">
                                <span className="text-slate-400 text-sm whitespace-nowrap">
                                    Welcome, <span className="text-white font-medium">{user.name}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition font-medium text-sm"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="flex items-center gap-2 hover:text-blue-400 transition font-medium">
                                <LogIn size={18} /> Login
                            </Link>
                            <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95">
                                <UserPlus size={18} /> Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-slate-100 p-2" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top duration-300">
                    <Link to="/" onClick={closeMenu} className="flex items-center gap-3 text-lg hover:text-blue-400">
                        <Search size={22} /> Jobs
                    </Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-3 text-lg hover:text-blue-400">
                                <LayoutDashboard size={22} /> Dashboard
                            </Link>
                            <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 text-lg hover:text-blue-400">
                                <User size={22} /> Profile
                            </Link>
                            {user.role === 'employer' && (
                                <Link to="/post-job" onClick={closeMenu} className="bg-blue-600 text-white p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                                    <Briefcase size={22} /> Post a Job
                                </Link>
                            )}
                            <div className="pt-4 border-t border-slate-800 flex flex-col gap-4">
                                <p className="text-slate-400">Signed in as <span className="text-white font-bold">{user.name}</span></p>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 text-red-400 font-bold py-2"
                                >
                                    <LogOut size={22} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Link to="/login" onClick={closeMenu} className="flex items-center justify-center gap-2 border border-slate-700 p-4 rounded-xl hover:bg-slate-800 transition">
                                <LogIn size={22} /> Login
                            </Link>
                            <Link to="/register" onClick={closeMenu} className="bg-blue-600 text-white p-4 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                                <UserPlus size={22} /> Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
