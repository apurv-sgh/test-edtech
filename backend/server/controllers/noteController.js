const Note = require('../models/Note');
const Course = require('../models/Course');
const Student = require('../models/Student');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');

// @desc    Upload a note for a course
// @route   POST /api/courses/:courseId/notes
// @access  Private
const uploadNote = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { title } = req.body;

    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    if (!title) {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting orphaned file due to missing title:', err);
        });
        res.status(400);
        throw new Error('Title is required');
    }

    const course = await Course.findById(courseId);
    if (!course) {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
        res.status(404);
        throw new Error('Course not found');
    }

    const note = await Note.create({
        title,
        course: courseId,
        filePath: req.file.path,
        fileName: req.file.originalname,
        uploadedBy: req.user._id
    });

    course.notes.push(note._id);
    await course.save();

    res.status(201).json(note);
});

// @desc    Get all notes for courses a student is enrolled in
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
    // console.log('User:', req.user);
    const student = await Student.findById(req.user._id);
// console.log('Student:', student);
    // console.log('Enrolled courses:', student?.enrolledCourses);
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    if (!Array.isArray(student.enrolledCourses)) {
        res.status(403);
        throw new Error('Enrollment data missing. Access denied.');
    }

    const notes = await Note.find({ 
        course: { $in: student.enrolledCourses } 
    })
    .populate('course', 'title')
    .populate('uploadedBy', 'name')
    .sort({ uploadDate: -1 });

    res.json(notes);
});


// @desc    Get all notes for a specific course
// @route   GET /api/notes/course/:courseId
// @access  Private
const getNotesForCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const student = await Student.findById(req.user._id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    if (!Array.isArray(student.enrolledCourses)) {
        res.status(403);
        throw new Error('Enrollment data missing. Access denied.');
    }

    const enrolledCourseIds = student.enrolledCourses.map(id => id.toString());

    if (!enrolledCourseIds.includes(courseId.toString()) && student.role !== 'admin') {
        res.status(403);
        throw new Error('Access denied. You are not enrolled in this course.');
    }

    const notes = await Note.find({ course: courseId }).populate('uploadedBy', 'name');
    res.json(notes);
});

// @desc    Download a specific note
// @route   GET /api/notes/:noteId/download
// @access  Private
const downloadNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
        res.status(404);
        throw new Error('Note not found');
    }

    const student = await Student.findById(req.user._id);

    const enrolledCourseIds = student.enrolledCourses.map(id => id.toString());

    if (!enrolledCourseIds.includes(note.course.toString()) && student.role !== 'admin') {
        res.status(403);
        throw new Error('Access denied. You are not enrolled in this course.');
    }

    // Try multiple possible file paths
    let filePath = null;
    const possiblePaths = [
        // Try the path as stored in database
        path.join(__dirname, '..', note.filePath),
        // Try without the /uploads prefix
        path.join(__dirname, '..', 'uploads', note.filePath.replace('/uploads/', '')),
        // Try just the filename in uploads directory
        path.join(__dirname, '..', 'uploads', note.fileName),
        // Try the path relative to uploads directory
        path.join(__dirname, '..', 'uploads', path.basename(note.filePath))
    ];

    console.log('Note filePath from DB:', note.filePath);
    console.log('Note fileName from DB:', note.fileName);
    console.log('Trying possible paths:');

    for (const tryPath of possiblePaths) {
        console.log('  Trying:', tryPath);
        if (fs.existsSync(tryPath)) {
            filePath = tryPath;
            console.log('  Found file at:', filePath);
            break;
        }
    }

    if (!filePath) {
        console.error('File not found. Tried paths:', possiblePaths);
        res.status(404);
        throw new Error('File not found on server');
    }

    res.download(filePath, note.fileName);
});

// @desc    Delete a note
// @route   DELETE /api/notes/:noteId
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.noteId);
    if (!note) {
        res.status(404);
        throw new Error('Note not found');
    }

    if (req.user.role !== 'admin' && note.uploadedBy.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Access denied. You are not authorized to delete this note.');
    }

    await Course.findByIdAndUpdate(note.course, { $pull: { notes: note._id } });

    const filePath = path.resolve(note.filePath);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
});

module.exports = {
    uploadNote,
    getNotesForCourse,
    downloadNote,
    deleteNote,
    getNotes
};
