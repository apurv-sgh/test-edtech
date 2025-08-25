const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizzesModels');
const Teacher = require('../models/Teacher'); // Make sure you have this
const { authenticateToken } = require('../middleware/auth');

// ✅ Create quiz
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, subject, questions, points } = req.body;
        const teacherId = req.user.teacherId || req.user.userId;

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ success: false, message: 'Teacher not found' });
        }

        const quiz = new Quiz({
            title,
            description,
            subject,
            questions,
            points,
            teacher: teacherId
        });

        await quiz.save();
        const quizObj = quiz.toObject();
        quizObj.id = quizObj._id;
        delete quizObj._id;

        res.status(201).json({ success: true, message: 'Quiz created successfully', quiz: quizObj });
    } catch (error) {
        console.error('Quiz creation error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// ✅ Update quiz
router.put('/:quizId', authenticateToken, async (req, res) => {
    try {
        const { quizId } = req.params;
        const teacherId = req.user.teacherId || req.user.userId;
        const updates = req.body;

        let quiz = await Quiz.findOne({ _id: quizId, teacher: teacherId });
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found or not authorized' });
        }

        Object.assign(quiz, updates);
        await quiz.save();

        quiz = quiz.toObject();
        quiz.id = quiz._id;
        delete quiz._id;

        res.json({ success: true, message: 'Quiz updated successfully', quiz });
    } catch (error) {
        console.error('Quiz update error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// ✅ Get all quizzes
router.get('/', async (req, res) => {
    try {
        const quizzes = await Quiz.find()
            .populate('teacher', 'name avatar')
            .sort({ createdAt: -1 });

        const formatted = quizzes.map(q => {
            const obj = q.toObject();
            obj.id = obj._id;
            delete obj._id;
            return obj;
        });

        res.json({ success: true, quizzes: formatted });
    } catch (error) {
        console.error('Get quizzes error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// ✅ Delete quiz
router.delete('/:quizId', authenticateToken, async (req, res) => {
    try {
        const { quizId } = req.params;
        const teacherId = req.user.teacherId || req.user.userId;

        const quiz = await Quiz.findOneAndDelete({ _id: quizId, teacher: teacherId });
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found or not authorized' });
        }

        res.json({ success: true, message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;


// server/routes/quizzes.js
// const express = require('express');
// const router = express.Router();
// const Quiz = require('../models/Quiz'); // Mongoose model

// // Get all quizzes
// router.get('/api/quizzes', async (req, res) => {
//   const quizzes = await Quiz.find();
//   res.json({ quizzes });
// });

// // Create a quiz
// router.post('/api/quizzes', async (req, res) => {
//   const quiz = new Quiz(req.body);
//   await quiz.save();
//   res.json({ quiz });
// });

// // Delete a quiz
// router.delete('/api/quizzes/:id', async (req, res) => {
//   await Quiz.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// });

// module.exports = router;