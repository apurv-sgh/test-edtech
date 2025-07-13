const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const Student = require('../models/Student');
const asyncHandler = require('express-async-handler');

// @desc    Create a new quiz for a course
// @route   POST /api/quizzes/courses/:courseId
// @access  Private
const createQuiz = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { title, questions, durationMinutes } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const quiz = await Quiz.create({
        title,
        course: courseId,
        questions,
        durationMinutes,
        createdBy: req.user._id
    });

    course.quizzes.push(quiz._id);
    await course.save();

    res.status(201).json(quiz);
});

// @desc    Get all quizzes for a specific course
// @route   GET /api/quizzes/courses/:courseId
// @access  Private
const getQuizzesForCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const student = await Student.findById(req.user._id);

    if (!student.enrolledCourses.includes(courseId) && student.role !== 'admin') {
        res.status(403);
        throw new Error('Access denied. You are not enrolled in this course.');
    }

    const quizzes = await Quiz.find({ course: courseId })
        .select('-questions.correctAnswerIndex'); // Hide correct answers from students
    res.json(quizzes);
});

// @desc    Get a specific quiz by ID
// @route   GET /api/quizzes/:quizId
// @access  Private
const getQuizById = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId).populate('course', 'title');
    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    const student = await Student.findById(req.user._id);
    if (!student.enrolledCourses.includes(quiz.course._id) && student.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to access this quiz.');
    }

    const quizResponse = quiz.toObject();
    if (student.role !== 'admin') {
        quizResponse.questions.forEach(q => delete q.correctAnswerIndex);
    }

    res.json(quizResponse);
});

// @desc    Update a quiz
// @route   PUT /api/quizzes/:quizId
// @access  Private
const updateQuiz = asyncHandler(async (req, res) => {
    const { title, questions, durationMinutes } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('User not authorized to update this quiz');
    }

    quiz.title = title || quiz.title;
    quiz.questions = questions || quiz.questions;
    quiz.durationMinutes = durationMinutes || quiz.durationMinutes;

    const updatedQuiz = await quiz.save();
    res.json(updatedQuiz);
});

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:quizId
// @access  Private
const deleteQuiz = asyncHandler(async (req, res) => {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    if (quiz.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('User not authorized to delete this quiz');
    }

    await Course.findByIdAndUpdate(quiz.course, { $pull: { quizzes: quiz._id } });
    await quiz.deleteOne();

    res.json({ message: 'Quiz removed' });
});

module.exports = {
    createQuiz,
    getQuizzesForCourse,
    getQuizById,
    updateQuiz,
    deleteQuiz
};


// This code defines a controller for managing quizzes in a course management system. It includes functions to create quizzes, retrieve quizzes for a specific course, get a specific quiz by ID, update quizzes, and delete quizzes. The createQuiz function checks if the course exists and saves the quiz to the database, while the getQuizzesForCourse function retrieves quizzes for a course, ensuring the user is enrolled or is an admin. The getQuizById function allows users to view a specific quiz, and the updateQuiz and deleteQuiz functions allow authorized users to modify or remove quizzes.
// The controller functions are exported for use in routing.