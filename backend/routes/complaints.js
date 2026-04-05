const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const auth = require('../middleware/auth');

// Submit complaint
router.post('/', auth, async (req, res) => {
    try {
        const { subject, description, category } = req.body;
        const complaint = await Complaint.create({
            subject, description, category,
            submittedBy: req.user.id
        });
        res.status(201).json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all complaints (admin/teacher)
router.get('/', auth, async (req, res) => {
    try {
        const complaints = req.user.role === 'student'
            ? await Complaint.find({ submittedBy: req.user.id })
            : await Complaint.find();
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update status (admin/teacher only)
router.patch('/:id', auth, async (req, res) => {
    try {
        if (req.user.role === 'student') return res.status(403).json({ message: 'Access denied' });
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(complaint);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;