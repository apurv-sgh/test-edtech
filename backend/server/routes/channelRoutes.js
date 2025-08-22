const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllChannels,
  getChannelById,
  createChannel,
  joinChannel,
  leaveChannel,
  getMyChannels,
  sendMessage,
  getChannelMessages,
  getSubjects,
  getTags,
  testChannels
} = require('../controllers/channelController');

// Protected routes (auth required)
router.use(protect);

// Get all communities (with /all endpoint for frontend compatibility)
router.get('/all', getAllChannels);
router.get('/', getAllChannels);

// Get user's joined communities
router.get('/my/channels', getMyChannels);

// Get available subjects and tags
router.get('/subjects', getSubjects);
router.get('/tags', getTags);

// Test endpoint
router.get('/test/channels', testChannels);

// Community messages (must come before /:id to avoid conflicts)
router.get('/:channelId/messages', getChannelMessages);
router.post('/:channelId/messages', sendMessage);

// Community membership (must come before /:id to avoid conflicts)
router.post('/:channelId/join', joinChannel);
router.delete('/:channelId/leave', leaveChannel);

// Community CRUD (this must be last to avoid conflicts with specific routes)
router.get('/:id', getChannelById);
router.post('/', createChannel);

module.exports = router; 