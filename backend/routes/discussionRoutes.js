const express = require('express');
const router = express.Router();
const {
    getAllDiscussions,
    getCourseDiscussions,
    getDiscussionById,
    createDiscussion,
    addComment,
    addReply,
    toggleLike
} = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get all discussions for a course
router.get('/course/:courseId', getCourseDiscussions);

// Get a single discussion
router.get('/:id', getDiscussionById);

// Create a new discussion
router.post('/', createDiscussion);

// Add a comment to a discussion
router.post('/:id/comments', addComment);

// Add a reply to a comment
router.post('/:id/comments/:commentId/replies', addReply);

// Like/Unlike a discussion
router.put('/:id/like', toggleLike);

// Get all discussions the user is authorized to see
router.get('/', getAllDiscussions);

module.exports = router; 