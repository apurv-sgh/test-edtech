const express = require('express');
const router = express.Router();
const TestSeries = require('../models/TestSeriesModel');
const { authenticateToken } = require('../middleware/auth'); // Your auth middleware

// Helper to format response
const formatTestSeries = (testSeries) => {
    const obj = testSeries.toObject();
    obj.id = obj._id;
    delete obj._id;
    return obj;
};

// GET all Test Series (for all logged-in users)
router.get('/', async (req, res) => {
    console.log('--- BACKEND: Hit GET /api/tests route ---');
    try {
        const testSeries = await TestSeries.find().sort({ createdAt: -1 });
        console.log('--- BACKEND: Data from DB ---', testSeries); 
        res.json({ testSeries: testSeries.map(formatTestSeries) });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// POST a new Test Series (teacher only)
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden: Only teachers can create tests' });
    }

    const { title, category, questions, duration } = req.body;
    try {
        const newTest = new TestSeries({
            title,
            category,
            questions,
            duration,
            teacher: req.user.teacherId || req.user.userId,
        });
        await newTest.save();
        res.status(201).json({ testSeries: formatTestSeries(newTest) });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create test series', error: error.message });
    }
});

// PUT (Update) a Test Series (teacher only)
router.put('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden: Only teachers can update tests' });
    }
    try {
        const test = await TestSeries.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test series not found' });
        }
        // Ensure the teacher owns this test
        if (test.teacher.toString() !== (req.user.teacherId || req.user.userId)) {
            return res.status(403).json({ message: 'Forbidden: You do not own this test' });
        }
        
        const updatedTest = await TestSeries.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(formatTestSeries(updatedTest));
    } catch (error) {
        res.status(500).json({ message: 'Failed to update test series', error: error.message });
    }
});

// DELETE a Test Series (teacher only)
router.delete('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Forbidden: Only teachers can delete tests' });
    }
    try {
        const test = await TestSeries.findById(req.params.id);
        if (!test) {
            return res.status(404).json({ message: 'Test series not found' });
        }
        // Ensure the teacher owns this test
        if (test.teacher.toString() !== (req.user.teacherId || req.user.userId)) {
            return res.status(403).json({ message: 'Forbidden: You do not own this test' });
        }

        await TestSeries.findByIdAndDelete(req.params.id);
        res.json({ message: 'Test series deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete test series', error: error.message });
    }
});

module.exports = router;