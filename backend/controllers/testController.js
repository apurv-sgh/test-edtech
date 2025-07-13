const Test = require('../models/Test');
const Course = require('../models/Course');
const Student = require('../models/Student');
const asyncHandler = require('express-async-handler');

// @desc    Create a new test for a course
// @route   POST /api/tests/courses/:courseId
// @access  Private
const createTest = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { title, questions, durationMinutes } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const test = await Test.create({
        title,
        course: courseId,
        questions,
        durationMinutes,
        createdBy: req.user._id
    });

    course.tests.push(test._id);
    await course.save();

    res.status(201).json(test);
});

// @desc    Get all tests for a specific course
// @route   GET /api/tests/courses/:courseId
// @access  Private
const getTestsforCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const student = await Student.findById(req.user._id);

    if (!student.enrolledCourses.includes(courseId) && student.role !== 'admin') {
        res.status(403);
        throw new Error('Access denied. You are not enrolled in this course.');
    }

    const tests = await Test.find({ course: courseId })
        .select('-questions.correctAnswerIndex'); // Hide correct answers from students
    res.json(tests);
});

// @desc    Get a specific test by ID
// @route   GET /api/tests/:testId
// @access  Private
const getTestById = asyncHandler(async (req, res) => {
    const test = await Test.findById(req.params.testId).populate('course', 'title');
    if (!test) {
        res.status(404);
        throw new Error('Test not found');
    }

    const student = await Student.findById(req.user._id);
    if (!student.enrolledCourses.includes(test.course._id) && student.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to access this test.');
    }

    const testResponse = test.toObject();
    if (student.role !== 'admin') {
        testResponse.questions.forEach(q => delete q.correctAnswerIndex);
    }

    res.json(testResponse);
});

// @desc    Update a test
// @route   PUT /api/tests/:testId
// @access  Private
const updateTest = asyncHandler(async (req, res) => {
    const { title, questions, durationMinutes } = req.body;
    const test = await Test.findById(req.params.testId);

    if (!test) {
        res.status(404);
        throw new Error('Test not found');
    }

    if (test.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('User not authorized to update this test');
    }

    test.title = title || test.title;
    test.questions = questions || test.questions;
    test.durationMinutes = durationMinutes || test.durationMinutes;

    const updatedTest = await test.save();
    res.json(updatedTest);
});

// @desc    Delete a test
// @route   DELETE /api/tests/:testId
// @access  Private
const deleteTest = asyncHandler(async (req, res) => {
    const test = await Test.findById(req.params.testId);
    if (!test) {
        res.status(404);
        throw new Error('Test not found');
    }

    if (test.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('User not authorized to delete this test');
    }

    await Course.findByIdAndUpdate(test.course, { $pull: { tests: test._id } });
    await test.deleteOne();

    res.json({ message: 'Test removed' });
});

module.exports = {
    createTest,
    getTestsforCourse,
    getTestById,
    updateTest,
    deleteTest
};