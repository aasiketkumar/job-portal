import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Briefcase, Building, MapPin, DollarSign, Send } from 'lucide-react';

const PostJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/jobs', formData);
            navigate('/');
        } catch (err) {
            setError('Failed to post job. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 pt-12">
            <div className="w-full max-w-2xl bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-white mb-8 flex items-center justify-center gap-2">
                    <Briefcase className="text-blue-400" /> Post a New Job
                </h2>
                {error && <p className="text-red-400 bg-red-400/10 p-3 rounded-lg mb-6 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm">Job Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Software Engineer"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm">Company Name</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Tech Corp"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Remote / New York"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm">Salary Range</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. $80k - $120k"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm">Job Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="4"
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Describe the role, responsibilities, and requirements..."
                            required
                        ></textarea>
                    </div>

                    <button className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg">
                        <Send size={20} /> Publish Job Listing
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
