import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { PlusCircle, Briefcase, MapPin, DollarSign, List, FileText } from 'lucide-react';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
        requirements: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get('/jobs'); // Get all then filter locally for simplicity since we don't have a single job route yet
                const job = res.data.find(j => j._id === id);
                if (job) {
                    setFormData({
                        title: job.title,
                        description: job.description,
                        company: job.company,
                        location: job.location,
                        salary: job.salary,
                        requirements: job.requirements
                    });
                }
            } catch (err) {
                alert('Failed to fetch job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/jobs/${id}`, formData);
            alert('Job updated successfully!');
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update job');
        }
    };

    if (loading) return <div className="text-white text-center p-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 pt-24">
            <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                    <PlusCircle className="text-blue-500" /> Edit Job Posting
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm flex items-center gap-2">
                                <Briefcase size={16} /> Job Title
                            </label>
                            <input
                                type="text" name="title" required
                                value={formData.title} onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm flex items-center gap-2">
                                <PlusCircle size={16} /> Company Name
                            </label>
                            <input
                                type="text" name="company" required
                                value={formData.company} onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm flex items-center gap-2">
                                <MapPin size={16} /> Location
                            </label>
                            <input
                                type="text" name="location" required
                                value={formData.location} onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-slate-400 text-sm flex items-center gap-2">
                                <DollarSign size={16} /> Salary
                            </label>
                            <input
                                type="text" name="salary" required
                                value={formData.salary} onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm flex items-center gap-2">
                            <FileText size={16} /> Job Description
                        </label>
                        <textarea
                            name="description" rows="4" required
                            value={formData.description} onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm flex items-center gap-2">
                            <List size={16} /> Requirements
                        </label>
                        <textarea
                            name="requirements" rows="3"
                            value={formData.requirements} onChange={handleChange}
                            placeholder="E.g. React, Node.js, MongoDB (comma separated)"
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                    >
                        Update Job
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditJob;
