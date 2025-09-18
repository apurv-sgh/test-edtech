const express = require('express');
const router = express.Router();

const {
    registerTeacher,
    loginTeacher
} = require('../controllers/authController');

const {
    getFeaturedTeachers,
    getAllTeachers,
    getTeacherById,
    getTeacherCourses
} = require('../controllers/teacherController');

// Public teacher routes (prefixed with /api/teachers)
router.post('/register', registerTeacher);
router.post('/login', loginTeacher);

// Get featured teachers (high-rated teachers with courses)
router.get('/featured', getFeaturedTeachers);

// Get all teachers
router.get('/', getAllTeachers);

// Get teacher by ID
router.get('/:id', getTeacherById);

// Get teacher's courses
router.get('/:id/courses', getTeacherCourses);

module.exports = router;