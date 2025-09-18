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

// Create a new seminar
exports.createSeminar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, date, time, fee } = req.body;

    // Validate required fields
    if (!title || !date || !time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, date, and time are required' 
      });
    }

    // Find the expert's profile
    let profile = await IndustryExpertProfile.findOne({ expert: userId });
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expert profile not found. Please create your profile first.' 
      });
    }

    // Create new seminar object
    const newSeminar = {
      title,
      description: description || '',
      date: new Date(date),
      time,
      fee: fee || 0
    };

    // Add seminar to the profile's seminars array
    profile.seminars.push(newSeminar);
    await profile.save();

    // Get the newly created seminar (last one in the array)
    const createdSeminar = profile.seminars[profile.seminars.length - 1];

    res.status(201).json({
      success: true,
      message: 'Seminar created successfully',
      data: createdSeminar
    });

  } catch (err) {
    console.error('Create seminar error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create seminar', 
      error: err.message 
    });
  }
};

// Get all seminars for an expert
exports.getMySeminars = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await IndustryExpertProfile.findOne({ expert: userId });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expert profile not found' 
      });
    }

    res.json({
      success: true,
      data: profile.seminars || []
    });

  } catch (err) {
    console.error('Get seminars error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch seminars', 
      error: err.message 
    });
  }
};

// Update a seminar
exports.updateSeminar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { seminarId } = req.params;
    const { title, description, date, time, fee } = req.body;

    const profile = await IndustryExpertProfile.findOne({ expert: userId });
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expert profile not found' 
      });
    }

    const seminar = profile.seminars.id(seminarId);
    if (!seminar) {
      return res.status(404).json({ 
        success: false, 
        message: 'Seminar not found' 
      });
    }

    // Update seminar fields
    if (title) seminar.title = title;
    if (description !== undefined) seminar.description = description;
    if (date) seminar.date = new Date(date);
    if (time) seminar.time = time;
    if (fee !== undefined) seminar.fee = fee;

    await profile.save();

    res.json({
      success: true,
      message: 'Seminar updated successfully',
      data: seminar
    });

  } catch (err) {
    console.error('Update seminar error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update seminar', 
      error: err.message 
    });
  }
};

// Delete a seminar
exports.deleteSeminar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { seminarId } = req.params;

    const profile = await IndustryExpertProfile.findOne({ expert: userId });
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expert profile not found' 
      });
    }

    // Check if seminar exists
    const seminar = profile.seminars.id(seminarId);
    if (!seminar) {
      return res.status(404).json({ 
        success: false, 
        message: 'Seminar not found' 
      });
    }

    // Remove the seminar using pull method
    profile.seminars.pull(seminarId);
    await profile.save();

    res.json({
      success: true,
      message: 'Seminar deleted successfully'
    });

  } catch (err) {
    console.error('Delete seminar error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete seminar', 
      error: err.message 
    });
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