
const express = require('express');
const LiveSession = require('../models/LiveSession');
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

// Create a new live session
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { title, description, subject, scheduledTime, duration, maxParticipants } = req.body;
    
    // Generate unique room ID
    const roomId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = new LiveSession({
      title,
      description,
      instructor: req.user._id,
      instructorName: req.user.name,
      subject,
      scheduledTime: new Date(scheduledTime),
      duration: duration || 60,
      maxParticipants: maxParticipants || 100,
      roomId
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Live session created successfully',
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start a live session
router.post('/:sessionId/start', authenticateToken, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only instructor can start the session' });
    }

    session.status = 'live';
    await session.save();

    res.json({
      success: true,
      message: 'Session started successfully',
      session
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Stop a live session
router.post('/:sessionId/stop', authenticateToken, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only instructor can stop the session' });
    }

    session.status = 'ended';
    await session.save();

    res.json({
      success: true,
      message: 'Session stopped successfully',
      session
    });
  } catch (error) {
    console.error('Stop session error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Join a live session
router.post('/:sessionId/join', authenticateToken, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.status !== 'live') {
      return res.status(400).json({ message: 'Session is not live' });
    }

    // Check if user is already a participant
    const existingParticipant = session.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (!existingParticipant) {
      if (session.participants.length >= session.maxParticipants) {
        return res.status(400).json({ message: 'Session is full' });
      }

      session.participants.push({
        userId: req.user._id,
        name: req.user.name,
        joinedAt: new Date()
      });

      await session.save();
    }

    res.json({
      success: true,
      message: 'Joined session successfully',
      session: {
        _id: session._id,
        title: session.title,
        roomId: session.roomId,
        instructor: session.instructorName,
        participants: session.participants.length
      }
    });
  } catch (error) {
    console.error('Join session error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all sessions
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, subject } = req.query;
    let query = {};

    if (status) query.status = status;
    if (subject) query.subject = subject;

    const sessions = await LiveSession.find(query)
      .sort({ scheduledTime: -1 })
      .populate('instructor', 'name email')
      .limit(20);

    res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get session by ID
router.get('/:sessionId', authenticateToken, async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.sessionId)
      .populate('instructor', 'name email avatar');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
