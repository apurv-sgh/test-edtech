const User = require('../models/Counsellor'); // Now User model
const IndustryExpertProfile = require('../models/IndustryExpertProfile');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new industry expert
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email, role: 'industry_expert' });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, role: 'industry_expert' });
    const token = jwt.sign({ id: user._id, role: 'industry_expert' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ ...user.toObject(), token });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'industry_expert' }).select('+password');
    if (!user) return res.status(404).json({ message: 'No such expert' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: 'industry_expert' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ ...user.toObject(), token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Create or update profile
exports.upsertProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;
    let profile = await IndustryExpertProfile.findOne({ expert: userId });
    if (profile) {
      Object.assign(profile, data);
      await profile.save();
    } else {
      profile = await IndustryExpertProfile.create({ ...data, expert: userId });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};

// Get own profile
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await IndustryExpertProfile.findOne({ expert: userId }).populate('expert', '-password');
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// Get all verified industry expert profiles (for frontend carousel)
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await IndustryExpertProfile.find({ status: 'verified' })
      .populate('expert', '-password')
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profiles', error: err.message });
  }
};

// Get a single industry expert profile by ID (public)
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await IndustryExpertProfile.findById(id)
      .populate('expert', '-password');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
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
    const profile = await IndustryExpertProfile.findById(id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    profile.status = status;
    profile.adminRemarks = adminRemarks;
    await profile.save();
    if (status === 'verified') {
      await User.findByIdAndUpdate(profile.expert, { isVerified: true });
    } else if (status === 'rejected') {
      await User.findByIdAndUpdate(profile.expert, { isVerified: false });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
}; 