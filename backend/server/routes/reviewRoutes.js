const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

// ========== COUNSELLOR REVIEWS ==========
// Public routes (no authentication required)
router.get('/counsellors/:counsellorId/reviews', reviewController.getCounsellorReviews);

// Protected routes (student authentication required)
router.post('/counsellors/:counsellorId/reviews', authMiddleware('student'), reviewController.createReview);

// ========== EXPERT REVIEWS ==========
// Public routes (no authentication required)
router.get('/industry-experts/:expertId/reviews', reviewController.getExpertReviews);

// Protected routes (student authentication required)
router.post('/industry-experts/:expertId/reviews', authMiddleware('student'), reviewController.createExpertReview);

// ========== GENERAL REVIEW MANAGEMENT ==========
router.put('/reviews/:reviewId', authMiddleware('student'), reviewController.updateReview);
router.delete('/reviews/:reviewId', authMiddleware('student'), reviewController.deleteReview);
router.post('/reviews/:reviewId/helpful', authMiddleware('student'), reviewController.markReviewHelpful);
router.get('/my-reviews', authMiddleware('student'), reviewController.getStudentReviews);

module.exports = router; 