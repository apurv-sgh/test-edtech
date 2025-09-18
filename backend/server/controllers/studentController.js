const User = require('../models/Student');
const bcrypt = require('bcryptjs');

// @desc    Update user profile (name, email - excluding password and avatar which have separate routes)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
const updateUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    if (await user.matchPassword(currentPassword)) {
      user.password = newPassword; // Pre-save hook in User model will hash it
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Current password incorrect' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user notification settings (example)
// @route   PUT /api/users/notifications
// @access  Private
const updateNotificationSettings = async (req, res) => {
  // For simplicity, let's assume notification settings are directly on the user model,
  // or you could have a separate NotificationSettings model.
  // For this example, we'll just return success.
  // In a real app, you'd update a `user.settings.notifications` object or similar.
  const user = await User.findById(req.user._id);

  if (user) {
    // Example: You might add a 'settings' object to your User model
    // user.settings.notifications = req.body.notifications;
    // await user.save();
    res.json({ message: 'Notification settings updated successfully', settings: req.body });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  updateUserProfile,
  updateUserPassword,
  updateNotificationSettings,
};