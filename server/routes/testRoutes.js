const express = require('express');
const {
      createTest,
      getTestsforCourse,
      getTestById,
      updateTest,
      deleteTest
} = require('../controllers/testController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Create a test for a course (admin/instructor)
router.post('/courses/:courseId', protect, createTest);

// Get all tests for a specific course (enrolled students)
router.get('/courses/:courseId', protect, getTestsforCourse);

// Get a specfic test by ID (enrolled students)
router.get('/:testId', protect, getTestById);

// Update a test (admin/instructor)
router.put('/:testId', protect, updateTest);

// Delete a test (admin/instructor)
router.delete('/:testId', protect, deleteTest);

module.exports = router;
// This code defines the routes for managing tests in an educational application using Express.js. It includes routes for creating a test for a course, retrieving all tests for a specific course, getting a specific test by ID, updating a test, and deleting a test. The `protect` middleware ensures that only authenticated users can access these routes, while the `isAdmin` middleware can be used to restrict certain actions to administrators or instructors. The routes are exported for use in the main application file.