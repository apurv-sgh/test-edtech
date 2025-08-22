const express = require('express');
const router = express.Router();
const counsellorController = require('../controllers/counsellorController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Auth
router.post('/register', counsellorController.register);
router.post('/login', counsellorController.login);

// Profile (counsellor must be logged in)
router.get('/me', authMiddleware('counsellor'), counsellorController.getMyProfile);
router.post('/profile', authMiddleware('counsellor'), upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]), counsellorController.upsertProfile);

// Admin verification
router.patch('/verify/:id', authMiddleware('admin'), counsellorController.verifyProfile);

// Public: Get all verified counsellor profiles
router.get('/profiles', counsellorController.getAllProfiles);

// Public: Get a single counsellor profile by id
router.get('/profile/:id', counsellorController.getProfileById);

module.exports = router; 