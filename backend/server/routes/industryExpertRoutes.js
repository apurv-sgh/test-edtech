const express = require('express');
const router = express.Router();
const industryExpertController = require('../controllers/industryExpertController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Auth
router.post('/register', industryExpertController.register);
router.post('/login', industryExpertController.login);

// Profile (industry expert must be logged in)
router.get('/me', authMiddleware('industry_expert'), industryExpertController.getMyProfile);
router.post('/profile', authMiddleware('industry_expert'), industryExpertController.upsertProfile);

// Admin verification
router.patch('/verify/:id', authMiddleware('admin'), industryExpertController.verifyProfile);

// Public: Get all verified industry expert profiles
router.get('/profiles', industryExpertController.getAllProfiles);
// Public: Get a single industry expert profile by ID
router.get('/profile/:id', industryExpertController.getProfileById);

module.exports = router; 