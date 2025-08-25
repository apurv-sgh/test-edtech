const express = require('express');
const router = express.Router();
const Competition = require('../models/Competition');
const { authenticateToken } = require('../middleware/auth'); // Your auth middleware

// GET all competitions (publicly accessible)
router.get('/', async (req, res) => {
    try {
        const competitions = await Competition.find().sort({ startsOn: -1 });
        res.json(competitions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new competition (teacher only)
router.post('/', authenticateToken, async (req, res) => {
    try {
    const newCompetition = new Competition({
        ...req.body,
        teacher: req.user.teacherId || req.user.userId,
    });
    await newCompetition.save(); // This is where the validation happens
    res.status(201).json(newCompetition);
} catch (error) {
    // --- THIS IS THE IMPROVED PART ---
    if (error.name === 'ValidationError') {
        // Extract the first validation error message for a cleaner response
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages[0] }); // Send the first error
    }
    // For other types of errors
    res.status(400).json({ message: 'Failed to create competition', error });
}
});


// PUT (update) a competition (teacher owner only)
router.put('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden: Teachers only' });
    }
    try {
        const competition = await Competition.findById(req.params.id);
        if (!competition) return res.status(404).json({ message: 'Competition not found' });

        if (competition.teacher.toString() !== (req.user.teacherId || req.user.userId)) {
            return res.status(403).json({ message: 'Not authorized to update this competition' });
        }
        
        const updated = await Competition.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update competition', error });
    }
});

// DELETE a competition (teacher owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden: Teachers only' });
    }
    try {
        const competition = await Competition.findById(req.params.id);
        if (!competition) return res.status(404).json({ message: 'Competition not found' });

        if (competition.teacher.toString() !== (req.user.teacherId || req.user.userId)) {
            return res.status(403).json({ message: 'Not authorized to delete this competition' });
        }

        await Competition.findByIdAndDelete(req.params.id);
        res.json({ message: 'Competition deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;