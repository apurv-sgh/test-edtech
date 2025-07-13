const StudyPlan = require('../models/StudyPlan');
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc    Get all study plans for a student
// @route   GET /api/study-plans
// @access  Private
const getStudyPlans = asyncHandler(async (req, res) => {
    const studyPlans = await StudyPlan.find({ student: req.user._id })
        .populate('sessions.course', 'title')
        .sort({ startDate: -1 });

    res.json(studyPlans);
});

// @desc    Get a single study plan
// @route   GET /api/study-plans/:id
// @access  Private
const getStudyPlanById = asyncHandler(async (req, res) => {
    const studyPlan = await StudyPlan.findById(req.params.id)
        .populate('sessions.course', 'title');

    if (!studyPlan) {
        res.status(404);
        throw new Error('Study plan not found');
    }

    // Check if the study plan belongs to the student
    if (studyPlan.student.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this study plan');
    }

    res.json(studyPlan);
});

// @desc    Create a new study plan
// @route   POST /api/study-plans
// @access  Private
const createStudyPlan = asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate, sessions, goals } = req.body;

    // Validate that all courses in sessions exist and student is enrolled (only if course is provided)
    for (const session of sessions) {
        if (session.course) {
            const course = await Course.findById(session.course);
            if (!course) {
                res.status(404);
                throw new Error(`Course not found: ${session.course}`);
            }

            if (!course.studentsEnrolled.includes(req.user._id)) {
                res.status(403);
                throw new Error(`Not enrolled in course: ${course.title}`);
            }
        }
    }

    const studyPlan = await StudyPlan.create({
        student: req.user._id,
        title,
        description,
        startDate,
        endDate,
        sessions,
        goals
    });

    const populatedStudyPlan = await StudyPlan.findById(studyPlan._id)
        .populate('sessions.course', 'title');

    res.status(201).json(populatedStudyPlan);
});

// @desc    Update a study plan
// @route   PUT /api/study-plans/:id
// @access  Private
const updateStudyPlan = asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate, sessions, goals } = req.body;

    const studyPlan = await StudyPlan.findById(req.params.id);
    if (!studyPlan) {
        res.status(404);
        throw new Error('Study plan not found');
    }

    // Check if the study plan belongs to the student
    if (studyPlan.student.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this study plan');
    }

    // Validate that all courses in sessions exist and student is enrolled (only if course is provided)
    for (const session of sessions) {
        if (session.course) {
            const course = await Course.findById(session.course);
            if (!course) {
                res.status(404);
                throw new Error(`Course not found: ${session.course}`);
            }

            if (!course.studentsEnrolled.includes(req.user._id)) {
                res.status(403);
                throw new Error(`Not enrolled in course: ${course.title}`);
            }
        }
    }

    studyPlan.title = title || studyPlan.title;
    studyPlan.description = description || studyPlan.description;
    studyPlan.startDate = startDate || studyPlan.startDate;
    studyPlan.endDate = endDate || studyPlan.endDate;
    studyPlan.sessions = sessions || studyPlan.sessions;
    studyPlan.goals = goals || studyPlan.goals;

    await studyPlan.save();

    const updatedStudyPlan = await StudyPlan.findById(studyPlan._id)
        .populate('sessions.course', 'title');

    res.json(updatedStudyPlan);
});

// @desc    Delete a study plan
// @route   DELETE /api/study-plans/:id
// @access  Private
const deleteStudyPlan = asyncHandler(async (req, res) => {
    const studyPlan = await StudyPlan.findById(req.params.id);
    if (!studyPlan) {
        res.status(404);
        throw new Error('Study plan not found');
    }

    // Check if the study plan belongs to the student
    if (studyPlan.student.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this study plan');
    }

    await StudyPlan.deleteOne({ _id: req.params.id });

    res.json({ message: 'Study plan removed' });
});

// @desc    Update session status
// @route   PUT /api/study-plans/:id/sessions/:sessionId
// @access  Private
const updateSessionStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const studyPlan = await StudyPlan.findById(req.params.id);
    if (!studyPlan) {
        res.status(404);
        throw new Error('Study plan not found');
    }

    // Check if the study plan belongs to the student
    if (studyPlan.student.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this study plan');
    }

    const session = studyPlan.sessions.id(req.params.sessionId);
    if (!session) {
        res.status(404);
        throw new Error('Session not found');
    }

    session.status = status;
    if (status === 'completed') {
        session.completedAt = new Date();
    }

    await studyPlan.save();

    res.json(session);
});

// @desc    Update goal status
// @route   PUT /api/study-plans/:id/goals/:goalId
// @access  Private
const updateGoalStatus = asyncHandler(async (req, res) => {
    const { completed } = req.body;

    const studyPlan = await StudyPlan.findById(req.params.id);
    if (!studyPlan) {
        res.status(404);
        throw new Error('Study plan not found');
    }

    // Check if the study plan belongs to the student
    if (studyPlan.student.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this study plan');
    }

    const goal = studyPlan.goals.id(req.params.goalId);
    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    goal.completed = completed;
    if (completed) {
        goal.completedAt = new Date();
    }

    await studyPlan.save();

    res.json(goal);
});

module.exports = {
    getStudyPlans,
    getStudyPlanById,
    createStudyPlan,
    updateStudyPlan,
    deleteStudyPlan,
    updateSessionStatus,
    updateGoalStatus
}; 