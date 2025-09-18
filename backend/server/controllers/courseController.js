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
    const { title, description, category, level, duration, price, thumbnail } = req.body;
    console.log('[COURSES] POST /api/courses payload:', { title, description, category, level, duration, price, thumbnail, userId: req.user && req.user._id });

    const course = await Course.create({
        title,
        description,
        category,
        level,
        duration,
        price,
        thumbnail,
        teacher: req.user._id
    });

    console.log('[COURSES] Created course:', { id: course._id, title: course.title });
    res.status(201).json(course);
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    console.log('[COURSES] GET /api/courses');
    const courses = await Course.find({}, '-studentsEnrolled -lessons')
        .populate('teacher', 'name email')
        .populate('tests', 'title')
        .populate('quizzes', 'title')
        .lean();

    console.log('[COURSES] Fetched count:', courses && courses.length);
    res.json(courses);
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)
        .select('-studentsEnrolled -lessons')
        .populate('teacher', 'name email')
        .populate('notes', 'title fileName uploadDate')
        .populate('tests', 'title')
        .populate('quizzes', 'title')
        .lean();

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
    const courseId = req.params.id;
    const studentId = req.user._id;

    // Atomically add student to course if not already present
    const courseUpdate = await Course.updateOne(
        { _id: courseId, studentsEnrolled: { $ne: studentId } },
        { $addToSet: { studentsEnrolled: studentId } }
    );

    if (courseUpdate.matchedCount === 0) {
        res.status(404);
        throw new Error('Course not found');
    }
    if (courseUpdate.modifiedCount === 0) {
        res.status(400);
        throw new Error('Already enrolled in this course');
    }

    // Ensure the student document exists and add the course if not present
    const studentUpdate = await Student.updateOne(
        { _id: studentId, enrolledCourses: { $ne: courseId } },
        { $addToSet: { enrolledCourses: courseId } }
    );

    if (studentUpdate.matchedCount === 0) {
        // rollback course enrollment to keep data consistent
        await Course.updateOne({ _id: courseId }, { $pull: { studentsEnrolled: studentId } });
        res.status(404);
        throw new Error('Student not found. Ensure this user is registered as a student.');
    }

    res.json({ message: 'Successfully enrolled in course' });
});

// @desc    Unenroll from a course
// @route   DELETE /api/courses/:id/unenroll
// @access  Private
const unenrollFromCourse = asyncHandler(async (req, res) => {
    const courseId = req.params.id;
    const studentId = req.user._id;

    // Atomically pull student from course
    const courseUpdate = await Course.updateOne(
        { _id: courseId, studentsEnrolled: studentId },
        { $pull: { studentsEnrolled: studentId } }
    );

    if (courseUpdate.matchedCount === 0) {
        res.status(404);
        throw new Error('Course not found');
    }
    if (courseUpdate.modifiedCount === 0) {
        res.status(400);
        throw new Error('Not enrolled in this course');
    }

    // Pull course from student's list if present
    await Student.updateOne(
        { _id: studentId },
        { $pull: { enrolledCourses: courseId } }
    );

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