import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Shield, BookOpen, Save, Award } from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: '',
        skills: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/me'); // We need to add this endpoint
                setFormData({
                    name: res.data.name,
                    bio: res.data.profile?.bio || '',
                    skills: res.data.profile?.skills?.join(', ') || ''
                });
            } catch (err) {
                console.error('Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
            const res = await api.put('/auth/profile', {
                name: formData.name,
                profile: {
                    bio: formData.bio,
                    skills: skillsArray
                }
            });
            const updatedUser = { ...user, name: res.data.name };
            setUser(updatedUser); // Update local context
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Sync localStorage
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white text-center p-20">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 pt-28 md:pt-36">
            <div className="max-w-2xl mx-auto">
                <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-12 relative overflow-hidden">
                        {/* Decorative circle */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                        <div className="relative flex flex-col items-center gap-6 text-center">
                            <div className="bg-white/20 p-5 rounded-[2.5rem] backdrop-blur-xl shadow-2xl border border-white/30 transform hover:scale-110 transition duration-500">
                                <User size={64} className="text-white" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">{user.name}</h1>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-md border border-white/30">
                                    <Shield size={14} className="text-blue-100" />
                                    <span className="text-blue-50 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                                        {user.role} Account
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-slate-400 text-sm flex items-center gap-2">
                                    <User size={16} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-slate-400 text-sm flex items-center gap-2">
                                    <BookOpen size={16} /> Short Bio
                                </label>
                                <textarea
                                    rows="3"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="text-slate-400 text-sm flex items-center gap-2">
                                    <Award size={16} /> Skills (Comma separated)
                                </label>
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    placeholder="React, Node.js, Design..."
                                    className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                            <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
