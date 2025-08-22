// routes/liveSessionRoutes.js

const express = require('express');
const router = express.Router(); // You must create the router instance

const {
  getSessions,
  createSession,
  updateSession,
  deleteSession
} = require('../controllers/liveSessionController'); // Adjust path if needed

const { protect } = require('../middleware/authMiddleware'); // Adjust path if needed

// Apply the 'auth' middleware to all routes in this file
// This is a valid way to protect all subsequent routes
router.use(protect);

// GET all sessions (logic is role-dependent) & POST a new session (teacher only)
router.route('/')
  .get(getSessions)
  // .post(isTeacher, createSession);

// PUT (update) and DELETE a specific session (teacher only)
router.route('/:id')
  // .put(isTeacher, updateSession)
  // .delete(isTeacher, deleteSession);


// ==================================================================
// THIS IS THE CRUCIAL FIX.
// You MUST export the router object that you have defined routes on.
// ==================================================================
module.exports = router;