const express = require('express');
const {
      createQuiz,
      getQuizzesForCourse,
      getQuizById,
      updateQuiz,
      deleteQuiz
} = require('../controllers/quizController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a quiz for a course (admin/instructor)
router.post('/courses/:courseId', protect, createQuiz); 

// Get all quizzes for a specific course (enrolled students)
router.get('/courses/:courseId', protect, getQuizzesForCourse);

// Get a specific quiz by ID (enrolled students)
router.get('/:quizId', protect, getQuizById);

// Update a quiz (admin/instructor)
router.put('/:quizId', protect, isAdmin, updateQuiz);

// Delete a quiz (admin/instructor)
router.delete('/:quizId', protect, isAdmin, deleteQuiz);

module.exports = router;
// This code defines the routes for managing quizzes in an educational application using Express.js. It includes routes for creating a quiz for a course, retrieving all quizzes for a specific course, getting a specific quiz by ID, updating a quiz, and deleting a quiz. The `protect` middleware ensures that only authenticated users can access these routes, while the `isAdmin` middleware restricts certain actions to administrators or instructors. The routes are exported for use in the main application file.