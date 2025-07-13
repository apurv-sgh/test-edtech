const express = require('express');
const {
    getCourses,
    getCourseById,
    enrollInCourse,
    unenrollFromCourse,
    getMyEnrolledCourses,
    createCourse,
    addLessonToCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Anyone can see courses, or use 'protect' if login is required to browse courses

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', getCourses);

// @desc    Get courses a student is enrolled in
// @route   GET /api/courses/my-courses
// @access  Private
router.get('/my-courses', protect, getMyEnrolledCourses);

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', getCourseById);

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private
router.post('/', protect, createCourse);

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
router.post('/:id/enroll', protect, enrollInCourse);

// @desc    Unenroll from a course
// @route   DELETE /api/courses/:id/unenroll
// @access  Private
router.delete('/:id/unenroll', protect, unenrollFromCourse);

router.post('/:courseId/lessons', protect, addLessonToCourse);

module.exports = router;
// This code defines the course-related routes for an educational application using Express.js. It includes routes for creating a course, getting all courses, getting a specific course by ID, enrolling in a course, unenrolling from a course, and retrieving courses a student is enrolled in. The `protect` middleware is used to secure certain routes, ensuring that only authenticated users can access them. The routes are exported for use in the main application file.