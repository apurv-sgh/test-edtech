const { populate } = require('dotenv');
const Course = require('../models/Course');
const Student = require('../models/Student');
const asyncHandler = require('express-async-handler');


// @desc    Add a lesson to a course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (admin or instructor)
const addLessonToCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { title, content, videoUrl, duration, resources } = req.body;
  
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
  
    const newLesson = {
      title,
      content,
      videoUrl,
      duration,
      resources
    };
  
    course.lessons.push(newLesson);
    await course.save();
  
    res.status(201).json({ success: true, lesson: newLesson });
  });

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private
const createCourse = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const course = await Course.create({
        title,
        description,
        teacher: req.user._id
    });
    res.status(201).json(course);
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ isPublished: true })
        .populate('teacher', 'name email')
        .populate('tests', 'title')
        .populate('quizzes', 'title')
        .select('-studentsEnrolled');

    res.json(courses);
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)
        .populate('teacher', 'name email')
        .populate('studentsEnrolled', 'name email')
        .populate('notes', 'title fileName uploadDate')
        .populate('tests', 'title')
        .populate('quizzes', 'title')
        .select('-studentsEnrolled');

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    res.json(course);
});

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollInCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if student already enrolled
    if (course.studentsEnrolled.includes(req.user._id)) {
        res.status(400);
        throw new Error('Already enrolled in this course');
    }

    // Add student to course
    course.studentsEnrolled.push(req.user._id);
    await course.save();

    // Fetch student and validate
    const student = await Student.findById(req.user._id);
    if (!student) {
        res.status(404);
        throw new Error('Student not found. Ensure this user is registered as a student.');
    }

    student.enrolledCourses.push(course._id);
    await student.save();

    res.json({ message: 'Successfully enrolled in course' });
});

// @desc    Unenroll from a course
// @route   DELETE /api/courses/:id/unenroll
// @access  Private
const unenrollFromCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if student is enrolled
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(400);
        throw new Error('Not enrolled in this course');
    }

    // Remove student from course
    course.studentsEnrolled = course.studentsEnrolled.filter(
        studentId => studentId.toString() !== req.user._id.toString()
    );
    await course.save();

    // Remove course from student's enrolled courses
    const student = await Student.findById(req.user._id);
    student.enrolledCourses = student.enrolledCourses.filter(
        courseId => courseId.toString() !== course._id.toString()
    );
    await student.save();

    res.json({ message: 'Successfully unenrolled from course' });
});

// @desc    Get courses a student is enrolled in
// @route   GET /api/courses/my-courses
// @access  Private
const getMyEnrolledCourses = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user._id).populate({
        path: 'enrolledCourses',
        populate: [
            { path: 'tests', select: 'title' },
            { path: 'quizzes', select: 'title' }
        ]
    });

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    res.json(student.enrolledCourses);
});

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    enrollInCourse,
    unenrollFromCourse,
    getMyEnrolledCourses,
    addLessonToCourse
};

// This code defines a course controller for a Node.js application, providing functionality to create, retrieve, enroll in, and unenroll from courses. It includes methods to handle course creation by any authenticated user, fetching all courses with populated related data (like tests and quizzes), enrolling and unenrolling students, and retrieving courses a student is enrolled in. Error handling is implemented to manage various scenarios such as course not found or already enrolled. The controller functions are exported for use in routing.