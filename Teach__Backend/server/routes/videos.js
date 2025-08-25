const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Videos');
const Teacher = require('../models/Teacher');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/videos/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept video files only
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only video files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  }
});

// POST /api/videos/upload - Upload a new video
router.post('/upload', authenticateToken, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded.' });
    }

    const { title, description, subject, topic, course, tags, visibility } = req.body;

    const teacherId = req.user.teacherId || req.user.userId;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      fs.unlinkSync(req.file.path); // Clean up uploaded file
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const video = new Video({
      title,
      description,
      teacher: teacherId,
      teacherName: teacher.name,
      subject,
      topic,
      course: course || null,
      url: `/uploads/videos/${req.file.filename}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      size: req.file.size,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      visibility: visibility || 'public'
    });

    await video.save();

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      video
    });
  } catch (error) {
    console.error('Video upload error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/videos/:videoId - Update video details
router.put('/:videoId', authenticateToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const teacherId = req.user.teacherId || req.user.userId;
    const updates = req.body || {};

    const video = await Video.findOne({ _id: videoId, teacher: teacherId });

    if (!video) {
      return res.status(404).json({ message: 'Video not found or you are not authorized to edit it.' });
    }

    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(tag => tag.trim());
    }

    // Prevent updating file-related fields
    const restrictedFields = ['url', 'filename', 'originalName', 'fileType', 'size'];
    restrictedFields.forEach(field => delete updates[field]);

    // Update only allowed fields
    Object.assign(video, updates);
    await video.save();

    res.json({
      success: true,
      message: 'Video updated successfully',
      video
    });
  } catch (error) {
    console.error('Video update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/videos/:videoId - Delete a video
router.delete('/:videoId', authenticateToken, async (req, res) => {
  try {
    const { videoId } = req.params;
    const teacherId = req.user.teacherId || req.user.userId;

    const video = await Video.findOne({ _id: videoId, teacher: teacherId });

    if (!video) {
      return res.status(404).json({ message: 'Video not found or you are not authorized to delete it.' });
    }

    // Delete the video file from the server
    const filePath = path.join(__dirname, '../../', video.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await video.deleteOne();

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get teacher's videos
router.get('/my-videos', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.teacherId || req.user.userId;
    const videos = await Video.find({ teacher: teacherId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      videos, // The response object contains a 'videos' array
    });
  } catch (error) {
    console.error('Get teacher videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/videos/:videoId - Get a single video
router.get('/:videoId', async (req, res) => {
    try {
      const video = await Video.findById(req.params.videoId)
        .populate('teacher', 'name avatar bio');
  
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      // For public videos, increment views
      if (video.visibility === 'public') {
          video.views += 1;
          await video.save();
      }
  
      res.json({
        success: true,
        video
      });
    } catch (error) {
      console.error('Get video error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });



module.exports = router;