const LiveClass = require('../models/LiveClass');
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc    Get all live classes for a course
// @route   GET /api/live-classes/course/:courseId
// @access  Private
const getCourseLiveClasses = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if student is enrolled in the course
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to access this course');
    }

    const liveClasses = await LiveClass.find({ course: req.params.courseId })
        .populate('teacher', 'name email')
        .sort({ startTime: 1 });

    res.json(liveClasses);
});

// @desc    Get a single live class
// @route   GET /api/live-classes/:id
// @access  Private
const getLiveClassById = asyncHandler(async (req, res) => {
    const liveClass = await LiveClass.findById(req.params.id)
        .populate('teacher', 'name email')
        .populate('course', 'title');

    if (!liveClass) {
        res.status(404);
        throw new Error('Live class not found');
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(liveClass.course);
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to access this live class');
    }

    res.json(liveClass);
});

// @desc    Join a live class
// @route   POST /api/live-classes/:id/join
// @access  Private
const joinLiveClass = asyncHandler(async (req, res) => {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
        res.status(404);
        throw new Error('Live class not found');
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(liveClass.course);
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to join this live class');
    }

    // Check if class is ongoing
    if (liveClass.status !== 'ongoing') {
        res.status(400);
        throw new Error('Live class is not currently ongoing');
    }

    // Check if student has already joined
    const alreadyJoined = liveClass.participants.find(
        p => p.student.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
        res.status(400);
        throw new Error('Already joined the live class');
    }

    // Add student to participants
    liveClass.participants.push({
        student: req.user._id,
        joinedAt: new Date()
    });

    await liveClass.save();

    res.json({
        message: 'Successfully joined live class',
        meetingLink: liveClass.meetingLink
    });
});

// @desc    Leave a live class
// @route   POST /api/live-classes/:id/leave
// @access  Private
const leaveLiveClass = asyncHandler(async (req, res) => {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
        res.status(404);
        throw new Error('Live class not found');
    }

    // Remove student from participants
    liveClass.participants = liveClass.participants.filter(
        p => p.student.toString() !== req.user._id.toString()
    );

    await liveClass.save();

    res.json({ message: 'Successfully left live class' });
});

module.exports = {
    getCourseLiveClasses,
    getLiveClassById,
    joinLiveClass,
    leaveLiveClass
}; 