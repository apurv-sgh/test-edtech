
const express = require('express');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Teacher Registration
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      specialization, 
      qualifications, 
      experience, 
      bio 
    } = req.body;
    
    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher already exists with this email' });
    }

    // Create new teacher
    const teacher = new Teacher({
      name,
      email,
      password,
      phone,
      specialization: specialization || [],
      qualifications,
      experience: experience || 0,
      bio
    });

    await teacher.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        teacherId: teacher._id, 
        email: teacher.email, 
        role: 'teacher' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Teacher registered successfully',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        specialization: teacher.specialization,
        experience: teacher.experience,
        rating: teacher.rating,
        totalStudents: teacher.totalStudents
      }
    });
  } catch (error) {
    console.error('Teacher registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Teacher Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    teacher.lastLogin = new Date();
    await teacher.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        teacherId: teacher._id, 
        email: teacher.email, 
        role: 'teacher' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        specialization: teacher.specialization,
        experience: teacher.experience,
        rating: teacher.rating,
        totalStudents: teacher.totalStudents,
        avatar: teacher.avatar,
        bio: teacher.bio
      }
    });
  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get teacher profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.teacherId || req.user.userId).select('-password');
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({
      success: true,
      teacher
    });
  } catch (error) {
    console.error('Teacher profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update teacher profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.teacherId || req.user.userId;
    const updates = req.body;
    
    // Remove password from updates for security
    delete updates.password;
    
    const teacher = await Teacher.findByIdAndUpdate(
      teacherId, 
      updates, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      teacher
    });
  } catch (error) {
    console.error('Teacher profile update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all teachers (public)
router.get('/all', async (req, res) => {
  try {
    const { page = 1, limit = 10, specialization, search } = req.query;
    
    let query = { isActive: true };
    
    if (specialization) {
      query.specialization = { $in: [specialization] };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const teachers = await Teacher.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 });

    const total = await Teacher.countDocuments(query);

    res.json({
      success: true,
      teachers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
