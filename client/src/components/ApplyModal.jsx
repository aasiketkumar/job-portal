import React, { useState } from 'react';
import { X, Send, FileUp, FileText, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ApplyModal = ({ job, onClose, onApply }) => {
    const [formData, setFormData] = useState({ coverLetter: '' });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please upload your resume');

        setLoading(true);
        try {
            // 1. Upload the file
            const uploadData = new FormData();
            uploadData.append('resume', file);

            const uploadRes = await api.post('/applications/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            // 2. Submit the application with the file path
            await onApply(job._id, {
                resumeLink: uploadRes.data.filePath,
                coverLetter: formData.coverLetter
            });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to upload/apply');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Apply for {job.title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm flex items-center gap-2">
                            <FileUp size={16} /> Upload Resume (PDF/Doc)
                        </label>
                        <div className="relative group">
                            <input
                                type="file"
                                required
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                                id="resume-upload"
                            />
                            <label
                                htmlFor="resume-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 rounded-xl cursor-pointer bg-slate-950 hover:bg-slate-800/50 hover:border-blue-500/50 transition duration-300"
                            >
                                {file ? (
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <CheckCircle size={20} />
                                        <span className="font-semibold text-sm truncate max-w-[200px]">{file.name}</span>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <FileUp className="mx-auto text-slate-500 mb-2" size={32} />
                                        <p className="text-xs text-slate-400">Click to upload from your device</p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {loading && uploadProgress > 0 && (
                            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-slate-400 text-sm flex items-center gap-2">
                            <FileText size={16} /> Cover Letter / Message
                        </label>
                        <textarea
                            rows="4"
                            placeholder="Why are you a good fit for this role?"
                            value={formData.coverLetter}
                            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? `Uploading ${uploadProgress}%...` : <><Send size={20} /> Submit Application</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyModal;
