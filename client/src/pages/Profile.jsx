import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Shield, BookOpen, Save, Award } from 'lucide-react';

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
            setUser({ ...user, name: res.data.name }); // Update local context
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-white text-center p-20">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 pt-24">
            <div className="max-w-2xl mx-auto">
                <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
                        <div className="flex items-center gap-6">
                            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                                <User size={48} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                                <p className="text-blue-100 flex items-center gap-1 opacity-80 uppercase tracking-widest text-xs font-bold mt-1">
                                    <Shield size={12} /> {user.role} Account
                                </p>
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
