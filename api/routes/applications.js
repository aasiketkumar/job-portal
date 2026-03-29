const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Upload resume endpoint
router.post('/upload', auth, upload.single('resume'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Get seeker's applications
router.get('/my-applications', auth, async (req, res) => {
    try {
        const applications = await Application.find({ seekerId: req.user.id })
            .populate('jobId')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update application status (Employer only)
router.patch('/status/:id', auth, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('jobId');
        if (!application) return res.status(404).json({ message: 'Application not found' });

        if (application.jobId.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        application.status = status;
        await application.save();
        res.json(application);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Withdraw application (Seeker only)
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'seeker') return res.status(403).json({ message: 'Unauthorized' });
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });
        if (application.seekerId.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

        await Application.findByIdAndDelete(req.params.id);
        res.json({ message: 'Application withdrawn' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
