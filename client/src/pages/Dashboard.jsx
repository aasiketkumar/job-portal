import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Briefcase, FileText, CheckCircle, Clock, XCircle, Users, ExternalLink, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJobId, setSelectedJobId] = useState(null); // For employers to view applicants
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, [user.role]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const url = user.role === 'employer' ? '/jobs/my-jobs' : '/applications/my-applications';
            const res = await api.get(url);
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicants = async (jobId) => {
        try {
            const res = await api.get(`/jobs/${jobId}/applicants`);
            setApplicants(res.data);
            setSelectedJobId(jobId);
        } catch (err) {
            toast.error('Failed to fetch applicants');
        }
    };

    const updateStatus = async (appId, status) => {
        try {
            await api.patch(`/applications/status/${appId}`, { status });
            fetchApplicants(selectedJobId); // Refresh applicants list
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleWithdraw = async (appId) => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) return;
        try {
            await api.delete(`/applications/${appId}`);
            toast.success('Application withdrawn successfully');
            fetchDashboardData();
        } catch (err) {
            toast.error('Failed to withdraw application');
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Deleting this job will also remove all its applications. Proceed?')) return;
        try {
            await api.delete(`/jobs/${jobId}`);
            toast.success('Job deleted successfully');
            if (selectedJobId === jobId) setSelectedJobId(null);
            fetchDashboardData();
        } catch (err) {
            toast.error('Failed to delete job');
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
            accepted: 'bg-green-400/10 text-green-400 border-green-400/20',
            rejected: 'bg-red-400/10 text-red-400 border-red-400/20',
        };
        const icons = {
            pending: <Clock size={14} />,
            accepted: <CheckCircle size={14} />,
            rejected: <XCircle size={14} />,
        };
        return (
            <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs border ${styles[status]}`}>
                {icons[status]} {status.toUpperCase()}
            </span>
        );
    };

    if (loading) return <div className="text-white text-center p-20">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 pt-28 md:pt-36">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome, {user.name}</h1>
                    <p className="text-slate-400">Manage your {user.role === 'employer' ? 'postings and applicants' : 'applications'} from here.</p>
                </header>

                {user.role === 'employer' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-4">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Briefcase className="text-blue-400" /> My Postings
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                {data.map((job) => (
                                    <div
                                        key={job._id}
                                        onClick={() => fetchApplicants(job._id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition ${selectedJobId === job._id ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                                    >
                                        <h3 className="font-bold">{job.title}</h3>
                                        <p className="text-xs text-slate-400">{job.location}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Users className="text-blue-400" /> {selectedJobId ? 'Applicants' : 'Select a job to view applicants'}
                            </h2>
                            {selectedJobId ? (
                                <div className="space-y-4">
                                    {applicants.length > 0 ? applicants.map((app) => (
                                        <div key={app._id} className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">{app.seekerId.name}</h3>
                                                <p className="text-slate-400 text-sm mb-3">{app.seekerId.email}</p>
                                                <div className="flex flex-wrap gap-4">
                                                    <a href={app.resumeLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-sm font-medium">
                                                        <ExternalLink size={14} /> View Resume
                                                    </a>
                                                    <StatusBadge status={app.status} />
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                                <button onClick={() => updateStatus(app._id, 'accepted')} className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-xs font-bold transition shadow-lg shadow-green-900/20">Accept</button>
                                                <button onClick={() => updateStatus(app._id, 'rejected')} className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-xs font-bold transition shadow-lg shadow-red-900/20">Reject</button>
                                            </div>
                                        </div>
                                    )) : <p className="text-slate-500 italic text-center py-10 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">No applicants yet for this position.</p>}
                                </div>
                            ) : (
                                <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-3xl h-[28rem] flex flex-col items-center justify-center text-slate-500 p-8 text-center max-w-lg mx-auto w-full lg:mt-12">
                                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                                        <Users className="opacity-40" size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-300 mb-2">No Selection Made</h3>
                                    <p className="max-w-xs mx-auto">Select a job posting from the list on the left to see who has applied for that position.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="text-blue-400" /> My Applications
                        </h2>
                        {data.map((app) => (
                            <div key={app._id} className="bg-slate-900 border border-slate-800 p-5 md:p-8 rounded-2xl shadow-lg hover:border-blue-500/30 hover:bg-slate-900/80 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1 text-white group-hover:text-blue-400 transition">{app.jobId.title}</h3>
                                    <p className="text-slate-400 mb-4 flex items-center gap-2">
                                        <Briefcase size={16} /> {app.jobId.company} • <MapPin size={16} /> {app.jobId.location}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium tracking-wide">APPLIED ON {new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-slate-800">
                                    <StatusBadge status={app.status} />
                                    {app.status === 'pending' && (
                                        <button
                                            onClick={() => handleWithdraw(app._id)}
                                            className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1 transition font-bold"
                                        >
                                            <Trash2 size={12} /> Withdraw
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {data.length === 0 && (
                            <div className="text-center py-32 bg-slate-900/20 rounded-[2rem] border-2 border-dashed border-slate-800">
                                <FileText className="mx-auto mb-6 opacity-20" size={64} />
                                <p className="text-2xl font-bold text-slate-300 mb-2">No Applications Yet</p>
                                <p className="text-slate-500 max-w-sm mx-auto">You haven't applied to any jobs yet. Start exploring and finding your dream career!</p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="mt-8 bg-blue-600/10 text-blue-400 px-6 py-2 rounded-full border border-blue-500/20 hover:bg-blue-600 hover:text-white transition font-bold"
                                >
                                    Browse Jobs
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
