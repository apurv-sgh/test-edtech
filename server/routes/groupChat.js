
const express = require('express');
const GroupChat = require('../models/GroupChat');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate user
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create a new group chat
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { name, description, type, subject, isPrivate, maxMembers } = req.body;
    
    const groupChat = new GroupChat({
      name,
      description,
      type: type || 'general',
      subject,
      admin: req.user._id,
      isPrivate: isPrivate || false,
      maxMembers: maxMembers || 500,
      members: [{
        userId: req.user._id,
        name: req.user.name,
        role: 'admin'
      }]
    });

    await groupChat.save();

    res.status(201).json({
      success: true,
      message: 'Group chat created successfully',
      groupChat
    });
  } catch (error) {
    console.error('Create group chat error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all group chats for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const groupChats = await GroupChat.find({
      'members.userId': req.user._id
    })
    .select('name description type subject members.length createdAt')
    .sort({ updatedAt: -1 });

    res.json({
      success: true,
      groupChats
    });
  } catch (error) {
    console.error('Get group chats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get group chat by ID with messages
router.get('/:chatId', authenticateToken, async (req, res) => {
  try {
    const groupChat = await GroupChat.findById(req.params.chatId)
      .populate('admin', 'name email avatar')
      .populate('moderators', 'name email avatar');

    if (!groupChat) {
      return res.status(404).json({ message: 'Group chat not found' });
    }

    // Check if user is a member
    const isMember = groupChat.members.some(
      member => member.userId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    // Get recent messages (last 50)
    const messages = groupChat.messages.slice(-50);

    res.json({
      success: true,
      groupChat: {
        ...groupChat.toObject(),
        messages
      }
    });
  } catch (error) {
    console.error('Get group chat error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join a group chat
router.post('/:chatId/join', authenticateToken, async (req, res) => {
  try {
    const groupChat = await GroupChat.findById(req.params.chatId);

    if (!groupChat) {
      return res.status(404).json({ message: 'Group chat not found' });
    }

    // Check if user is already a member
    const isMember = groupChat.members.some(
      member => member.userId.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: 'You are already a member' });
    }

    // Check if group is full
    if (groupChat.members.length >= groupChat.maxMembers) {
      return res.status(400).json({ message: 'Group is full' });
    }

    // Add user to members
    groupChat.members.push({
      userId: req.user._id,
      name: req.user.name,
      role: 'member'
    });

    // Add system message
    groupChat.messages.push({
      sender: req.user._id,
      senderName: 'System',
      message: `${req.user.name} joined the group`,
      messageType: 'system'
    });

    await groupChat.save();

    res.json({
      success: true,
      message: 'Joined group successfully'
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send message to group chat
router.post('/:chatId/message', authenticateToken, async (req, res) => {
  try {
    const { message, messageType, replyTo } = req.body;
    const groupChat = await GroupChat.findById(req.params.chatId);

    if (!groupChat) {
      return res.status(404).json({ message: 'Group chat not found' });
    }

    // Check if user is a member
    const isMember = groupChat.members.some(
      member => member.userId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    // Create new message
    const newMessage = {
      sender: req.user._id,
      senderName: req.user.name,
      message,
      messageType: messageType || 'text',
      replyTo: replyTo || null
    };

    groupChat.messages.push(newMessage);
    
    // Update last seen for sender
    const memberIndex = groupChat.members.findIndex(
      member => member.userId.toString() === req.user._id.toString()
    );
    if (memberIndex !== -1) {
      groupChat.members[memberIndex].lastSeen = new Date();
    }

    await groupChat.save();

    // Get the newly created message
    const savedMessage = groupChat.messages[groupChat.messages.length - 1];

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageData: savedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get messages for a group chat
router.get('/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const groupChat = await GroupChat.findById(req.params.chatId);

    if (!groupChat) {
      return res.status(404).json({ message: 'Group chat not found' });
    }

    // Check if user is a member
    const isMember = groupChat.members.some(
      member => member.userId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    // Get paginated messages
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const messages = groupChat.messages.slice(Math.max(0, groupChat.messages.length - endIndex), groupChat.messages.length - startIndex);

    res.json({
      success: true,
      messages: messages.reverse(),
      totalMessages: groupChat.messages.length
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
