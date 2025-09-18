const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getUserProfile, updateUserProfilePicture } = require('../controllers/profileController');

router.get('/', protect, getUserProfile);
router.put('/picture', protect, upload.single('profilePicture'), updateUserProfilePicture);

module.exports = router;