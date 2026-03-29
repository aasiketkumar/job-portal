import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, MapPin, DollarSign, Building, CheckCircle, Loader2, X } from 'lucide-react';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [search, setSearch] = useState('');

    const fetchJobs = async (query = '') => {
        setLoading(true);
        if (query) setSearching(true);
        console.log('Fetching jobs with query:', query || 'NONE');
        try {
            const res = await api.get(`/jobs${query}`);
            console.log('Search Response:', res.data.length, 'jobs found');
            if (Array.isArray(res.data)) {
                setJobs(res.data);
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search button clicked. Search term:', search);
        fetchJobs(`?search=${search}`);
    };

    const clearSearch = () => {
        setSearch('');
        fetchJobs();
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleApply = async (jobId, data) => {
        try {
            await api.post(`/jobs/apply/${jobId}`, data);
            alert('Application submitted successfully!');
            setSelectedJob(null);
            fetchJobs(); // Refresh to show "Applied"
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 pt-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8">Find Your Dream Job</h1>

                <form onSubmit={handleSearch} className="flex gap-2 mb-12 bg-slate-900 p-2 rounded-lg shadow-xl border border-slate-800">
                    <Search className="text-slate-400 self-center ml-2" />
                    <input
                        type="text"
                        placeholder="Search jobs, companies, keywords..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 p-3 rounded text-slate-100 focus:outline-none"
                    />
                    {search && (
                        <button type="button" onClick={clearSearch} className="text-slate-500 hover:text-white px-2">
                            <X size={20} />
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        {searching ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
                    </button>
                </form>

                {loading && !searching ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <Loader2 className="animate-spin mb-4" size={48} />
                        <p>Loading the latest jobs for you...</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.length > 0 ? jobs.map((job) => (
                            <div key={job._id} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-blue-500/50 transition cursor-pointer group shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-400 transition">{job.title}</h2>
                                        <div className="flex flex-wrap gap-4 text-slate-400 mb-4">
                                            <span className="flex items-center gap-1"><Building size={16} /> {job.company}</span>
                                            <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                                            <span className="flex items-center gap-1"><DollarSign size={16} /> {job.salary}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {job.appliedStatus ? (
                                            <span className="flex items-center gap-1 text-green-400 bg-green-400/10 px-4 py-2 rounded-lg border border-green-400/20 font-semibold self-start">
                                                <CheckCircle size={18} /> Applied
                                            </span>
                                        ) : user?.role === 'seeker' ? (
                                            <button
                                                onClick={() => setSelectedJob(job)}
                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                                            >
                                                Apply Now
                                            </button>
                                        ) : !user ? (
                                            <button
                                                onClick={() => alert('Please login as a seeker to apply')}
                                                className="bg-slate-800 text-slate-400 px-6 py-2 rounded-lg border border-slate-700 hover:text-white transition font-semibold"
                                            >
                                                Apply Now
                                            </button>
                                        ) : null}
                                        {user?.id === job.postedBy && (
                                            <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Your Posting</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-slate-400 line-clamp-2">{job.description}</p>
                            </div>
                        )) : (
                            <div className="text-center text-slate-500 py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                                <Search className="mx-auto mb-4 opacity-20" size={48} />
                                <p className="text-xl font-medium mb-1">No matches found</p>
                                <p className="text-sm">
                                    {user?.role === 'employer'
                                        ? "Try posting a new job or search for something else!"
                                        : "Try adjusting your keywords or clearing the search filter."}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {selectedJob && (
                    <ApplyModal
                        job={selectedJob}
                        onClose={() => setSelectedJob(null)}
                        onApply={handleApply}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
