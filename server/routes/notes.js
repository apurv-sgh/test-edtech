
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Note = require('../models/Note');
const Teacher = require('../models/Teacher');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/notes/';
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
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, images, and text files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload notes
router.post('/upload', authenticateToken, upload.array('files', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      subject,
      topic,
      course,
      tags,
      visibility
    } = req.body;

    const teacherId = req.user.teacherId || req.user.userId;
    const teacher = await Teacher.findById(teacherId);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Process uploaded files
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/notes/${file.filename}`,
      fileType: file.mimetype,
      size: file.size
    })) : [];

    const note = new Note({
      title,
      description,
      content,
      teacher: teacherId,
      teacherName: teacher.name,
      subject,
      topic,
      course: course || null,
      files,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      visibility: visibility || 'public'
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Notes uploaded successfully',
      note
    });
  } catch (error) {
    console.error('Notes upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all notes (public)
router.get('/all', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      subject, 
      topic, 
      search,
      visibility = 'public'
    } = req.query;

    let query = { isPublished: true };
    
    if (visibility !== 'all') {
      query.visibility = visibility;
    }
    
    if (subject) query.subject = subject;
    if (topic) query.topic = topic;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { teacherName: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const notes = await Note.find(query)
      .populate('teacher', 'name avatar')
      .populate('course', 'title')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Note.countDocuments(query);

    res.json({
      success: true,
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get teacher's notes
router.get('/my-notes', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.teacherId || req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const notes = await Note.find({ teacher: teacherId })
      .populate('course', 'title')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Note.countDocuments({ teacher: teacherId });

    res.json({
      success: true,
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get teacher notes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single note
router.get('/:noteId', async (req, res) => {
  try {
    const note = await Note.findById(req.params.noteId)
      .populate('teacher', 'name avatar bio')
      .populate('course', 'title description');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Increment views
    note.views += 1;
    await note.save();

    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download note file
router.get('/download/:noteId/:fileIndex', async (req, res) => {
  try {
    const { noteId, fileIndex } = req.params;
    
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const fileIdx = parseInt(fileIndex);
    if (fileIdx < 0 || fileIdx >= note.files.length) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = note.files[fileIdx];
    const filePath = path.join(__dirname, '../../uploads/notes/', file.filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Increment downloads
    note.downloads += 1;
    await note.save();

    res.download(filePath, file.originalName);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update note
router.put('/:noteId', authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const teacherId = req.user.teacherId || req.user.userId;
    const updates = req.body;

    const note = await Note.findOne({ _id: noteId, teacher: teacherId });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found or not authorized' });
    }

    // Process tags if provided
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(tag => tag.trim());
    }

    Object.keys(updates).forEach(key => {
      note[key] = updates[key];
    });

    await note.save();

    res.json({
      success: true,
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Note update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete note
router.delete('/:noteId', authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const teacherId = req.user.teacherId || req.user.userId;

    const note = await Note.findOneAndDelete({ 
      _id: noteId, 
      teacher: teacherId 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or not authorized' });
    }

    // Delete associated files
    note.files.forEach(file => {
      const filePath = path.join(__dirname, '../../uploads/notes/', file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like/Unlike note
router.post('/:noteId/like', authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.userId;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const likeIndex = note.likes.findIndex(like => like.user.toString() === userId);
    
    if (likeIndex > -1) {
      // Unlike
      note.likes.splice(likeIndex, 1);
    } else {
      // Like
      note.likes.push({ user: userId });
    }

    await note.save();

    res.json({
      success: true,
      message: likeIndex > -1 ? 'Note unliked' : 'Note liked',
      likesCount: note.likes.length
    });
  } catch (error) {
    console.error('Like note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
