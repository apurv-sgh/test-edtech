const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllDiscussions,
  getCourseDiscussions,
  getDiscussionById,
  getDiscussionMessages,
  sendMessage,
  replyToMessage,
  resolveDoubt,
  toggleMessageLike,
  markMessagesAsRead,
  createDiscussion,
  addComment,
  addReply,
  toggleLike,
  deleteDiscussion
} = require('../controllers/discussionController');

// All routes are protected
router.use(protect);

// Get all discussions the user is authorized to see
router.get('/', getAllDiscussions);

// Get all discussions for a course
router.get('/course/:courseId', getCourseDiscussions);

// Get a single discussion
router.get('/:id', getDiscussionById);

// Chat-like messaging endpoints
router.get('/:id/messages', getDiscussionMessages);
router.post('/:id/messages', sendMessage);
router.post('/:id/messages/:messageId/replies', replyToMessage);
router.put('/:id/messages/:messageId/like', toggleMessageLike);
router.put('/:id/messages/:messageId/resolve', resolveDoubt);
router.put('/:id/messages/read', markMessagesAsRead);

// Create a new discussion
router.post('/', createDiscussion);

// Delete a discussion
router.delete('/:id', deleteDiscussion);

// Add a comment to a discussion
router.post('/:id/comments', addComment);

// Add a reply to a comment
router.post('/:id/comments/:commentId/replies', addReply);

// Like/Unlike a discussion
router.put('/:id/like', toggleLike);

module.exports = router; 