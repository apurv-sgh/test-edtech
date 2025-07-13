const express = require('express');
const router = express.Router();
const {
    getCourseLiveClasses,
    getLiveClassById,
    joinLiveClass,
    leaveLiveClass
} = require('../controllers/liveClassController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get all live classes for a course
router.get('/course/:courseId', getCourseLiveClasses);

// Get a single live class
router.get('/:id', getLiveClassById);

// Join a live class
router.post('/:id/join', joinLiveClass);

// Leave a live class
router.post('/:id/leave', leaveLiveClass);

module.exports = router; 