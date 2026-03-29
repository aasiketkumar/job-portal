const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log('Registering user:', { name, email, role });

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password, role });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret');
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get current user data
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, profile } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, profile },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
