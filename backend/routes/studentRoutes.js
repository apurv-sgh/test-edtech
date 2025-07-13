const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    registerStudent,
    loginStudent,
    getStudentProfile,
    updateStudentProfile,
    changePassword,
    logoutStudent
} = require('../controllers/authController');

// Public routes
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// Protected student routes (these will be prefixed with /api/students)
router.use(protect);
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.put('/change-password', changePassword);
router.post('/logout', logoutStudent);

module.exports = router;
// This code defines the authentication routes for a student in an educational application using Express.js. It includes routes for signing up a new student, logging in to get a token, and retrieving the current student's profile. The `protect` middleware is used to secure the profile route, ensuring that only authenticated users can access it. The routes are exported for use in the main application file.