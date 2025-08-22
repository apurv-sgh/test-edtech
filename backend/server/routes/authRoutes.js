const express = require('express');
const router = express.Router();
const { protect , authMiddleware} = require('../middleware/authMiddleware');
const {
    registerStudent,
    registerTeacher,
    loginStudent,
    getStudentProfile,
    updateStudentProfile,
    changePassword,
    logoutStudent
} = require('../controllers/authController');
const counsellorController = require('../controllers/counsellorController');
const upload = require('../middleware/uploadMiddleware');
const bcrypt = require('bcryptjs');


// Public routes
router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/register', counsellorController.register);
router.post('/login', counsellorController.login);

// Profile (counsellor must be logged in)
router.get('/me', authMiddleware('counsellor'), counsellorController.getMyProfile);
router.post('/profile', authMiddleware('counsellor'), upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'documents', maxCount: 5 }
]), counsellorController.upsertProfile);
// Public: Get all verified counsellor profiles
router.get('/profiles', counsellorController.getAllProfiles);

// Public: Get a single counsellor profile by id
router.get('/profile/:id', counsellorController.getProfileById);

// Protected routes
router.use(protect);
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.put('/change-password', changePassword);
router.post('/logout', logoutStudent);

// TEMPORARY: Reset password for a user by email (for admin use only, remove after use)
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.status(400).json({ message: 'Email and newPassword required' });
  try {
    const user = await require('../models/Student').findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password', error: err.message });
  }
});

module.exports = router;
// This code defines the authentication routes for a student in an educational application using Express.js. It includes routes for signing up a new student, logging in to get a token, and retrieving the current student's profile. The `protect` middleware is used to secure the profile route, ensuring that only authenticated users can access it. The routes are exported for use in the main application file.