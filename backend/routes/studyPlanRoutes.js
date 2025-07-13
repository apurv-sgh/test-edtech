const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getStudyPlans,
    getStudyPlanById,
    createStudyPlan,
    updateStudyPlan,
    deleteStudyPlan,
    updateSessionStatus,
    updateGoalStatus
} = require('../controllers/studyPlanController');

// @desc    Get all study plans for a student
// @route   GET /api/study-plans
// @access  Private
router.get('/', protect, getStudyPlans);

// @desc    Get a single study plan
// @route   GET /api/study-plans/:id
// @access  Private
router.get('/:id', protect, getStudyPlanById);

// @desc    Create a new study plan
// @route   POST /api/study-plans
// @access  Private
router.post('/', protect, createStudyPlan);

// @desc    Update a study plan
// @route   PUT /api/study-plans/:id
// @access  Private
router.put('/:id', protect, updateStudyPlan);

// @desc    Delete a study plan
// @route   DELETE /api/study-plans/:id
// @access  Private
router.delete('/:id', protect, deleteStudyPlan);

// @desc    Update session status
// @route   PUT /api/study-plans/:id/sessions/:sessionId
// @access  Private
router.put('/:id/sessions/:sessionId', protect, updateSessionStatus);

// @desc    Update goal status
// @route   PUT /api/study-plans/:id/goals/:goalId
// @access  Private
router.put('/:id/goals/:goalId', protect, updateGoalStatus);

module.exports = router; 