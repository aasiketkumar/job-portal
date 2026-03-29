const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Get all jobs (with optional search and application status)
router.get('/', async (req, res) => {
    try {
        const { search, location } = req.query;
        console.log('Job query received:', { search, location });
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 });

        // If user is logged in, attach application status
        const token = req.header('Authorization')?.replace('Bearer ', '');
        let seekerId = null;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
                if (decoded.role === 'seeker') seekerId = decoded.id;
            } catch (e) { }
        }

        const jobsWithStatus = await Promise.all(jobs.map(async (job) => {
            let status = null;
            if (seekerId) {
                const app = await Application.findOne({ jobId: job._id, seekerId });
                status = app ? app.status : null;
            }
            return { ...job._doc, appliedStatus: status };
        }));

        res.json(jobsWithStatus);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Post a job (Employer only)
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const { title, description, company, location, salary, requirements } = req.body;
        const newJob = new Job({ title, description, company, location, salary, requirements, postedBy: req.user.id });
        await newJob.save();
        res.json(newJob);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update a job (Employer only)
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Unauthorized' });
    try {
        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.postedBy.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(job);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete a job (Employer only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.postedBy.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        await Job.findByIdAndDelete(req.params.id);
        await Application.deleteMany({ jobId: req.params.id });
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get employer's posted jobs
router.get('/my-jobs', auth, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get applicants for a specific job (Employer only)
router.get('/:id/applicants', auth, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const job = await Job.findById(req.params.id);
        if (job.postedBy.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        const applicants = await Application.find({ jobId: req.params.id }).populate('seekerId', 'name email profile');
        res.json(applicants);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Apply for a job
router.post('/apply/:id', auth, async (req, res) => {
    if (req.user.role !== 'seeker') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const { resumeLink, coverLetter } = req.body;
        const existing = await Application.findOne({ jobId: req.params.id, seekerId: req.user.id });
        if (existing) return res.status(400).json({ message: 'Already applied for this job' });

        const application = new Application({
            jobId: req.params.id,
            seekerId: req.user.id,
            resumeLink,
            coverLetter
        });
        await application.save();
        res.json(application);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
