const express = require('express');
const {
      uploadNote,
      getNotesForCourse,
      downloadNote,
      deleteNote,
      getNotes
} =  require('../controllers/noteController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = require('../middleware/uploadMiddleware'); 
const router = express.Router();
const uploads = multer({ dest: 'uploads/' });

// Get all notes for courses a student is enrolled in
router.get('/', protect, getNotes);

// Upload a note for a specific course, 'noteFile' is the name of the file input in the form-data.
router.post('/course/:courseId/upload', protect, uploads.single('noteFile'), uploadNote);

// Get all notes for a specific course (student must be enrolled)
router.get('/course/:courseId', protect, getNotesForCourse);

// Download a specific note (student must be enrolled in the note's course)
router.get('/:noteId/download', protect, downloadNote);

// Delete a note (admin or uploader)
router.delete('/:noteId', protect, isAdmin, deleteNote);

module.exports = router;
// This code defines the routes for managing notes in an educational application using Express.js. It includes routes for uploading notes, retrieving notes for a specific course, downloading a note, and deleting a note. The `protect` middleware ensures that only authenticated users can access these routes, while the `isAdmin` middleware restricts deletion to administrators. The routes are exported for use in the main application file. The `uploadMiddleware` handles file uploads using Multer.