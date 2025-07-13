const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');
const { protect } = require('../middleware/authMiddleware');

// Test route (no auth required)
router.get('/test', channelController.testChannels);

// Public routes (no auth required for browsing)
router.get('/all', channelController.getAllChannels);
router.get('/subjects', channelController.getSubjects);
router.get('/tags', channelController.getTags);

// Protected routes (auth required)
router.use(protect);

// Channel management
router.post('/', channelController.createChannel);
router.get('/my/channels', channelController.getMyChannels);

// Channel-specific routes (must come after /my/channels)
router.get('/:id', channelController.getChannelById);
router.post('/:channelId/join', channelController.joinChannel);
router.delete('/:channelId/leave', channelController.leaveChannel);

// Messaging
router.post('/:channelId/messages', channelController.sendMessage);
router.get('/:channelId/messages', channelController.getChannelMessages);

module.exports = router; 