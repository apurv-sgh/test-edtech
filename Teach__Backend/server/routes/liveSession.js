const express = require('express');
const router = express.Router();

const {
  getSessions,
  createSession,
  updateSession,
  deleteSession
} = require('../controllers/liveSessionController');

const { authenticateToken, isTeacher } = require('../middleware/auth');

// GET all sessions — public or role-dependent logic
router.get('/', getSessions);

// POST a new session — requires authentication and teacher role
router.post('/', authenticateToken, isTeacher, createSession);

// PUT and DELETE — requires authentication and teacher role
router.put('/:id', authenticateToken, isTeacher, updateSession);
router.delete('/:id', authenticateToken, isTeacher, deleteSession);

module.exports = router;
