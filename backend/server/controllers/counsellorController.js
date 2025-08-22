const User = require('../models/Counsellor'); // Now User model
const CounsellorProfile = require('../models/CounsellorProfile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new counsellor
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email, role: 'counsellor' });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: 'counsellor' });
    const token = jwt.sign({ id: user._id, role: 'counsellor' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: "Registration successful",
      token,
      user: { ...user.toObject(), password: undefined }   // ✅ return inside "user"
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login counsellor
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'counsellor' }).select('+password');
    if (!user) return res.status(404).json({ message: 'No such counsellor' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: 'counsellor' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Create or update profile
exports.upsertProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    // Debug log
    console.log('[PROFILE_UPDATE] userId:', userId, 'body:', data, 'files:', req.files);
    // Handle file uploads
    if (req.files && req.files.profilePicture && req.files.profilePicture[0]) {
      data.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
    }
    // Parse skills/topics if sent as comma-separated strings
    if (typeof data.skills === 'string') {
      data.skills = data.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof data.topics === 'string') {
      data.topics = data.topics.split(',').map(s => s.trim()).filter(Boolean);
    }
    let profile = await CounsellorProfile.findOne({ counsellor: userId });
    if (profile) {
      Object.assign(profile, data);
      await profile.save();
    } else {
      profile = await CounsellorProfile.create({ ...data, counsellor: userId, status: 'pending' });
    }
    res.json(profile);
  } catch (err) {
    console.error('[PROFILE_UPDATE_ERROR]', err, err.stack);
    res.status(500).json({ message: 'Profile update failed', error: err.message, stack: err.stack });
  }
};

// Get own profile
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await CounsellorProfile.findOne({ counsellor: userId }).populate('counsellor', '-password');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// Admin: verify or reject profile
exports.verifyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;
    const profile = await CounsellorProfile.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    profile.status = status;
    profile.adminRemarks = adminRemarks;
    await profile.save();
    // Optionally update User.isVerified
    if (status === 'verified') {
      await User.findByIdAndUpdate(profile.counsellor, { isVerified: true });
    } else if (status === 'rejected') {
      await User.findByIdAndUpdate(profile.counsellor, { isVerified: false });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};

// Get all verified counsellor profiles (for frontend carousel)
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await CounsellorProfile.find({ status: 'verified' })
      .populate('counsellor', '-password')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profiles', error: err.message });
  }
};

// Public: Get a single counsellor profile by id
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await CounsellorProfile.findById(id).populate('counsellor', '-password');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    
    // Get availability data for this counsellor
    const CounsellorAvailability = require('../models/CounsellorAvailability');
    const availability = await CounsellorAvailability.findOne({ counsellor: profile.counsellor._id });
    
    // Combine profile and availability data
    const responseData = {
      ...profile.toObject(),
      stopTakingBookings: availability?.stopTakingBookings || false,
      stopBookingReason: availability?.stopBookingReason || ''
    };
    
    res.json(responseData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
}; 