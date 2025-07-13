const express = require('express');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create a new course
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subject,
      level,
      duration,
      price,
      syllabus,
      prerequisites,
      learningOutcomes,
      tags,
      maxStudents,
      startDate,
      endDate
    } = req.body;

    const teacherId = req.user.teacherId || req.user.userId;
    const teacher = await Teacher.findById(teacherId);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const course = new Course({
      title,
      description,
      instructor: teacherId,
      instructorName: teacher.name,
      category,
      subject,
      level: level || 'beginner',
      duration,
      price: price || 0,
      syllabus: syllabus || [],
      prerequisites: prerequisites || [],
      learningOutcomes: learningOutcomes || [],
      tags: tags || [],
      maxStudents: maxStudents || 100,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Course creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update course
router.put('/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.teacherId || req.user.userId;
    const updates = req.body;

    const course = await Course.findOne({ _id: courseId, instructor: teacherId });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found or not authorized' });
    }

    Object.keys(updates).forEach(key => {
      course[key] = updates[key];
    });

    await course.save();

    res.json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Course update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all courses (public)
router.get('/all', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      subject, 
      level, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = { isPublished: true, isActive: true };
    
    if (category) query.category = category;
    if (subject) query.subject = subject;
    if (level) query.level = level;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructorName: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar rating')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get teacher's courses
router.get('/my-courses', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.teacherId || req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const courses = await Course.find({ instructor: teacherId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments({ instructor: teacherId });

    res.json({
      success: true,
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get teacher courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single course
router.get('/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('instructor', 'name avatar bio rating experience specialization');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete course
router.delete('/:courseId', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.teacherId || req.user.userId;

    const course = await Course.findOneAndDelete({ 
      _id: courseId, 
      instructor: teacherId 
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found or not authorized' });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Enroll student in course
router.post('/:courseId/enroll', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.userId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === studentId
    );

    if (isEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Check if course is full
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ message: 'Course is full' });
    }

    course.enrolledStudents.push({ student: studentId });
    await course.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Course enrollment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
