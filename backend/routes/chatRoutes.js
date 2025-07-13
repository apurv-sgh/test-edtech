const express = require('express');
const router = express.Router();
const {
    getCourseChats,
    getChatById,
    sendMessage,
    markMessagesAsRead
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Get all chats for a course
router.get('/course/:courseId', getCourseChats);

// Get a single chat
router.get('/:id', getChatById);

// Send a message in a chat
router.post('/:id/messages', sendMessage);

// Mark messages as read
router.put('/:id/read', markMessagesAsRead);

module.exports = router; 