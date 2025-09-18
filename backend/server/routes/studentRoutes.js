const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const User = require('../models/Student');
const { protect } = require('../middleware/authMiddleware');
const imageUpload = require('../middleware/imageUploadMiddleware');
const {
    registerStudent,
    loginStudent,
    getStudentProfile,
    updateStudentProfile,
    changePassword,
    logoutStudent
} = require('../controllers/authController');

// Public routes
router.post('/register', registerStudent);
router.post('/login', loginStudent);
// Profile picture upload route (protected)
router.post('/upload-profile-pic', protect, imageUpload.single('profilePic'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        // Get the user from the token
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Delete old profile picture if it exists
        if (user.profilePicture && user.profilePicture !== 'https://res.cloudinary.com/your_cloud_name/image/upload/v1/default_avatar.png') {
            const oldFilePath = path.join(__dirname, '../uploads', path.basename(user.profilePicture));
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        // Update user's profile picture
        const profilePicUrl = `/uploads/${req.file.filename}`;
        user.profilePicture = profilePicUrl;
        await user.save();

        res.json({ 
            success: true, 
            message: 'Profile picture uploaded successfully', 
            avatar: profilePicUrl,
            profilePicture: profilePicUrl
        });
    } catch (error) {
        console.error('Error uploading profile picture: ', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error uploading profile picture' 
        });
    }
});

router.get('profile/:id', async (req, res) => {
      try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
})

// Protected student routes (these will be prefixed with /api/students)
router.use(protect);
router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.put('/change-password', changePassword);
router.post('/logout', logoutStudent);

module.exports = router;
// This code defines the authentication routes for a student in an educational application using Express.js. It includes routes for signing up a new student, logging in to get a token, and retrieving the current student's profile. The `protect` middleware is used to secure the profile route, ensuring that only authenticated users can access it. The routes are exported for use in the main application file.
