import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Briefcase, FileText, CheckCircle, Clock, XCircle, Users, ExternalLink, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            alert('Failed to fetch applicants');
        }
    };

    const updateStatus = async (appId, status) => {
        try {
            await api.patch(`/applications/status/${appId}`, { status });
            fetchApplicants(selectedJobId); // Refresh applicants list
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleWithdraw = async (appId) => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) return;
        try {
            await api.delete(`/applications/${appId}`);
            fetchDashboardData();
        } catch (err) {
            alert('Failed to withdraw application');
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Deleting this job will also remove all its applications. Proceed?')) return;
        try {
            await api.delete(`/jobs/${jobId}`);
            if (selectedJobId === jobId) setSelectedJobId(null);
            fetchDashboardData();
        } catch (err) {
            alert('Failed to delete job');
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
        <div className="min-h-screen bg-slate-950 text-white p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}</h1>
                    <p className="text-slate-400">Manage your {user.role === 'employer' ? 'postings and applicants' : 'applications'} from here.</p>
                </header>

                {user.role === 'employer' ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-4">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Briefcase className="text-blue-400" /> My Postings
                            </h2>
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
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Users className="text-blue-400" /> {selectedJobId ? 'Applicants' : 'Select a job to view applicants'}
                            </h2>
                            {selectedJobId ? (
                                <div className="space-y-4">
                                    {applicants.length > 0 ? applicants.map((app) => (
                                        <div key={app._id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">{app.seekerId.name}</h3>
                                                <p className="text-slate-400 text-sm mb-3">{app.seekerId.email}</p>
                                                <div className="flex gap-4">
                                                    <a href={app.resumeLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-sm">
                                                        <ExternalLink size={14} /> View Resume
                                                    </a>
                                                    <StatusBadge status={app.status} />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => updateStatus(app._id, 'accepted')} className="bg-green-600 hover:bg-green-700 p-2 rounded text-xs font-bold transition">Accept</button>
                                                <button onClick={() => updateStatus(app._id, 'rejected')} className="bg-red-600 hover:bg-red-700 p-2 rounded text-xs font-bold transition">Reject</button>
                                            </div>
                                        </div>
                                    )) : <p className="text-slate-500 italic">No applicants yet for this position.</p>}
                                </div>
                            ) : (
                                <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl h-64 flex items-center justify-center text-slate-500">
                                    Click on a job posting to see who has applied.
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
                            <div key={app._id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg hover:border-slate-700 transition flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{app.jobId.title}</h3>
                                    <p className="text-slate-400 mb-4">{app.jobId.company} • {app.jobId.location}</p>
                                    <p className="text-xs text-slate-500">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col items-end gap-4">
                                    <StatusBadge status={app.status} />
                                    {app.status === 'pending' && (
                                        <button
                                            onClick={() => handleWithdraw(app._id)}
                                            className="text-xs text-red-500 hover:underline flex items-center gap-1"
                                        >
                                            <Trash2 size={12} /> Withdraw
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {data.length === 0 && <p className="text-center text-slate-500 p-20">You haven't applied to any jobs yet.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
