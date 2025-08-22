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
        .populate('author', 'name email profilePicture')
        .populate('comments.author', 'name email profilePicture')
        .populate('messages.sender', 'name email profilePicture')
        .populate('lastMessage.sender', 'name email profilePicture')
        .sort({ isPinned: -1, createdAt: -1 });

    res.json(discussions);
});

// @desc    Get a single discussion with messages
// @route   GET /api/discussions/:id
// @access  Private
const getDiscussionById = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id)
        .populate('author', 'name email profilePicture')
        .populate('comments.author', 'name email profilePicture')
        .populate('comments.replies.author', 'name email profilePicture')
        .populate('messages.sender', 'name email profilePicture')
        .populate('messages.replies.sender', 'name email profilePicture')
        .populate('lastMessage.sender', 'name email profilePicture');

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

// @desc    Get discussion messages with pagination
// @route   GET /api/discussions/:id/messages
// @access  Private
const getDiscussionMessages = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, filter } = req.query;
    const discussion = await Discussion.findById(req.params.id);

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

    let messages = discussion.messages;

    // Apply filters
    if (filter === 'doubts') {
        messages = messages.filter(msg => msg.isDoubt);
    } else if (filter === 'unresolved') {
        messages = messages.filter(msg => msg.isDoubt && !msg.isResolved);
    } else if (filter === 'resolved') {
        messages = messages.filter(msg => msg.isDoubt && msg.isResolved);
    }

    // Sort messages by creation time (newest first)
    messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const skip = (page - 1) * limit;
    const paginatedMessages = messages.slice(skip, skip + parseInt(limit));

    // Populate sender information
    const populatedMessages = await Discussion.populate(paginatedMessages, {
        path: 'sender replies.sender',
        select: 'name email profilePicture'
    });

    res.json({
        messages: populatedMessages.reverse(), // Show oldest first
        pagination: {
            current: parseInt(page),
            total: Math.ceil(messages.length / limit),
            hasNext: skip + paginatedMessages.length < messages.length,
            hasPrev: page > 1
        },
        statistics: {
            totalMessages: discussion.messageCount,
            totalDoubts: discussion.doubtCount,
            resolvedDoubts: discussion.resolvedDoubtCount,
            participants: discussion.participantCount
        }
    });
});

// @desc    Send a message to a discussion
// @route   POST /api/discussions/:id/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { content, messageType = 'text', attachments = [], isDoubt = false, doubtType = 'general' } = req.body;

    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
        res.status(404);
        throw new Error('Discussion not found');
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(discussion.course);
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to send messages to this discussion');
    }

    const message = {
        content,
        sender: req.user._id,
        senderType: req.user.userType || 'Student',
        messageType,
        attachments,
        isDoubt,
        doubtType,
        readBy: [{
            user: req.user._id,
            userType: req.user.userType || 'Student'
        }]
    };

    discussion.messages.push(message);
    discussion.lastMessage = message;
    await discussion.save();

    const populatedMessage = await Discussion.findById(discussion._id)
        .populate('messages.sender', 'name email profilePicture')
        .then(discussion => discussion.messages[discussion.messages.length - 1]);

    res.status(201).json(populatedMessage);
});

// @desc    Reply to a message
// @route   POST /api/discussions/:id/messages/:messageId/replies
// @access  Private
const replyToMessage = asyncHandler(async (req, res) => {
    const { content, messageType = 'text', attachments = [] } = req.body;

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

    const message = discussion.messages.id(req.params.messageId);
    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    const reply = {
        content,
        sender: req.user._id,
        senderType: req.user.userType || 'Student',
        messageType,
        attachments,
        createdAt: new Date()
    };

    message.replies.push(reply);
    await discussion.save();

    const populatedReply = await Discussion.findById(discussion._id)
        .populate('messages.replies.sender', 'name email profilePicture')
        .then(discussion => {
            const message = discussion.messages.id(req.params.messageId);
            return message.replies[message.replies.length - 1];
        });

    res.status(201).json(populatedReply);
});

// @desc    Mark a doubt as resolved
// @route   PUT /api/discussions/:id/messages/:messageId/resolve
// @access  Private (Teachers only)
const resolveDoubt = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
        res.status(404);
        throw new Error('Discussion not found');
    }

    // Check if user is a teacher
    if (req.user.userType !== 'Teacher') {
        res.status(403);
        throw new Error('Only teachers can resolve doubts');
    }

    const message = discussion.messages.id(req.params.messageId);
    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    if (!message.isDoubt) {
        res.status(400);
        throw new Error('This message is not marked as a doubt');
    }

    message.isResolved = true;
    message.resolvedBy = req.user._id;
    message.resolvedByType = req.user.userType;
    message.resolvedAt = new Date();

    await discussion.save();

    res.json({ message: 'Doubt marked as resolved' });
});

// @desc    Like/Unlike a message
// @route   PUT /api/discussions/:id/messages/:messageId/like
// @access  Private
const toggleMessageLike = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
        res.status(404);
        throw new Error('Discussion not found');
    }

    // Check if student is enrolled in the course
    const course = await Course.findById(discussion.course);
    if (!course.studentsEnrolled.includes(req.user._id)) {
        res.status(403);
        throw new Error('Not authorized to like messages in this discussion');
    }

    const message = discussion.messages.id(req.params.messageId);
    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    const likeIndex = message.likes.findIndex(
        like => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex === -1) {
        // Add like
        message.likes.push({
            user: req.user._id,
            userType: req.user.userType || 'Student'
        });
    } else {
        // Remove like
        message.likes.splice(likeIndex, 1);
    }

    await discussion.save();

    res.json({ message: likeIndex === -1 ? 'Message liked' : 'Message unliked' });
});

// @desc    Mark messages as read
// @route   PUT /api/discussions/:id/messages/read
// @access  Private
const markMessagesAsRead = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id);
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

    const currentTime = new Date();
    discussion.messages.forEach(message => {
        const alreadyRead = message.readBy.some(
            read => read.user.toString() === req.user._id.toString()
        );
        
        if (!alreadyRead) {
            message.readBy.push({
                user: req.user._id,
                userType: req.user.userType || 'Student',
                readAt: currentTime
            });
        }
    });

    await discussion.save();

    res.json({ message: 'Messages marked as read' });
});

// @desc    Delete a discussion
// @route   DELETE /api/discussions/:id
// @access  Private (Teachers only)
const deleteDiscussion = asyncHandler(async (req, res) => {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
        res.status(404);
        throw new Error('Discussion not found');
    }

    // Check if user is a teacher and is the teacher of the course
    const course = await Course.findById(discussion.course);
    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (req.user.userType !== 'Teacher' || course.teacher.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Only the course teacher can delete discussions');
    }

    await Discussion.findByIdAndDelete(req.params.id);

    res.json({ message: 'Discussion deleted successfully' });
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
        .populate('author', 'name email profilePicture');

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
        .populate('comments.author', 'name email profilePicture')
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
        .populate('comments.replies.author', 'name email profilePicture')
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
        .populate('author', 'name email profilePicture')
        .populate('comments.author', 'name email profilePicture')
        .populate('lastMessage.sender', 'name email profilePicture')
        .sort({ isPinned: -1, createdAt: -1 });
    res.json(discussions);
});

module.exports = {
    getAllDiscussions,
    getCourseDiscussions,
    getDiscussionById,
    getDiscussionMessages,
    sendMessage,
    replyToMessage,
    resolveDoubt,
    toggleMessageLike,
    markMessagesAsRead,
    createDiscussion,
    addComment,
    addReply,
    toggleLike,
    deleteDiscussion
}; 