const Discussion = require('../models/Discussion');
const Course = require('../models/Course');
const asyncHandler = require('express-async-handler');

// @desc    Get all discussions for a course
// @route   GET /api/discussions/course/:courseId
// @access  Private
const getCourseDiscussions = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if student is enrolled in the course
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to access this course');
    }

    const discussions = await Discussion.find({ course: req.params.courseId })
        .populate('author', 'name email')
        .populate('comments.author', 'name email')
        .sort({ isPinned: -1, createdAt: -1 });

    res.json(discussions);
});

// @desc    Get a single discussion
// @route   GET /api/discussions/:id
// @access  Private
const getDiscussionById = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id)
        .populate('author', 'name email')
        .populate('comments.author', 'name email')
        .populate('comments.replies.author', 'name email');

    if (!discussion) {
        res.status(404);
        throw new Error('Discussion not found');
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(discussion.course);
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to access this discussion');
    }

    res.json(discussion);
});

// @desc    Create a new discussion
// @route   POST /api/discussions
// @access  Private (Teachers only)
const createDiscussion = asyncHandler(async (req, res) => {
    const { title, content, courseId, tags } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Check if user is a teacher and is the teacher of this course
    if (req.user.userType !== 'Teacher' || course.teacher.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Only the course teacher can create discussions');
    }

    const discussion = await Discussion.create({
        title,
        content,
        course: courseId,
        author: req.user._id,
        authorType: 'Teacher',
        tags
    });

    const populatedDiscussion = await Discussion.findById(discussion._id)
        .populate('author', 'name email');

    res.status(201).json(populatedDiscussion);
});

// @desc    Add a comment to a discussion
// @route   POST /api/discussions/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
        res.status(404);
        throw new Error('Discussion not found');
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(discussion.course);
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to comment on this discussion');
    }

    const comment = {
        content,
        author: req.user._id,
        authorType: req.user.userType || 'Student'
    };

    discussion.comments.push(comment);
    await discussion.save();

    const populatedComment = await Discussion.findById(discussion._id)
        .populate('comments.author', 'name email')
        .then(discussion => discussion.comments[discussion.comments.length - 1]);

    res.status(201).json(populatedComment);
});

// @desc    Add a reply to a comment
// @route   POST /api/discussions/:id/comments/:commentId/replies
// @access  Private
const addReply = asyncHandler(async (req, res) => {
    const { content } = req.body;

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
        res.status(404);
        throw new Error('Discussion not found');
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(discussion.course);
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to reply to this discussion');
    }

    const comment = discussion.comments.id(req.params.commentId);
    if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
    }

    const reply = {
        content,
        author: req.user._id,
        authorType: req.user.userType || 'Student',
        createdAt: new Date()
    };

    comment.replies.push(reply);
    await discussion.save();

    const populatedReply = await Discussion.findById(discussion._id)
        .populate('comments.replies.author', 'name email')
        .then(discussion => {
            const comment = discussion.comments.id(req.params.commentId);
            return comment.replies[comment.replies.length - 1];
        });

    res.status(201).json(populatedReply);
});

// @desc    Like/Unlike a discussion
// @route   PUT /api/discussions/:id/like
// @access  Private
const toggleLike = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
        res.status(404);
        throw new Error('Discussion not found');
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(discussion.course);
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to like this discussion');
    }

    const likeIndex = discussion.likes.findIndex(
        like => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex === -1) {
        // Add like
        discussion.likes.push({
            user: req.user._id,
            userType: req.user.userType || 'Student'
        });
    } else {
        // Remove like
        discussion.likes.splice(likeIndex, 1);
    }

    await discussion.save();

    res.json({ message: likeIndex === -1 ? 'Discussion liked' : 'Discussion unliked' });
});

// @desc    Get all discussions the user is authorized to see
// @route   GET /api/discussions
// @access  Private
const getAllDiscussions = asyncHandler(async (req, res) => {
    let courses;
    if (req.user.userType === 'Teacher') {
        // Teacher: get courses they teach
        courses = await Course.find({ teacher: req.user._id });
    } else {
        // Student: get courses they are enrolled in
        courses = await Course.find({ studentsEnrolled: req.user._id });
    }
    const courseIds = courses.map(c => c._id);
    const discussions = await Discussion.find({ course: { $in: courseIds } })
        .populate('author', 'name email')
        .populate('comments.author', 'name email')
        .sort({ isPinned: -1, createdAt: -1 });
    res.json(discussions);
});

module.exports = {
    getAllDiscussions,
    getCourseDiscussions,
    getDiscussionById,
    createDiscussion,
    addComment,
    addReply,
    toggleLike
}; 