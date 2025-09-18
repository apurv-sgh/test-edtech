const User = require('../models/Student');
const fs = require('fs');
const path = require('path');

// @desc    Save user profile picture (POST)
// @route   POST /api/profile/picture
// @access  Private
async function postUserProfilePicture(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally delete old profile picture here

        // Save new profile picture path
        user.profilePicture = `uploads/${req.file.filename}`;
        await user.save();

        res.json({
            message: 'Profile picture saved successfully',
            profilePicture: user.profilePicture
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        // req.user is set by the protect middleware
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile picture
// @route   PUT /api/profile/picture
// @access  Private
const updateUserProfilePicture = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optionally delete old profile picture here

        // Save new profile picture path
        user.profilePicture = `uploads/${req.file.filename}`;
        await user.save();

        res.json({
            message: 'Profile picture updated successfully',
            profilePicture: user.profilePicture
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getUserProfile,
    postUserProfilePicture,
    updateUserProfilePicture
};