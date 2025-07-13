const Chat = require('../models/Chat');
const Course = require('../models/Course');
require('../models/Teacher');
const asyncHandler = require('express-async-handler');

// @desc    Get all chats for a course
// @route   GET /api/chats/course/:courseId
// @access  Private
const getCourseChats = asyncHandler(async (req, res) => {
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

    const chats = await Chat.find({ course: req.params.courseId })
        .populate('participants.user', 'name email')
        .populate('lastMessage')
        .sort({ updatedAt: -1 });

    res.json(chats);
});

// @desc    Get a single chat
// @route   GET /api/chats/:id
// @access  Private
const getChatById = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params.id)
        .populate('participants.user', 'name email')
        .populate('messages.sender', 'name email');

    if (!chat) {
        res.status(404);
        throw new Error('Chat not found');
    }

    // Check if student is a participant
    const isParticipant = chat.participants.some(
        p => p.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error('Not authorized to access this chat');
    }

    res.json(chat);
});

// @desc    Send a message in a chat
// @route   POST /api/chats/:id/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { content, attachments } = req.body;

    if (!content && (!attachments || attachments.length === 0)) {
        res.status(400);
        throw new Error('Message content or attachments are required');
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
        res.status(404);
        throw new Error('Chat not found');
    }

    // Check if student is a participant
    const isParticipant = chat.participants.some(
        p => p.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error('Not authorized to send messages in this chat');
    }

    const message = {
        sender: req.user._id,
        senderType: 'Student',
        content,
        attachments,
        readBy: [{
            user: req.user._id,
            userType: 'Student',
            readAt: new Date()
        }]
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    await chat.save();

    // Populate the message with sender details
    const populatedMessage = await Chat.findById(chat._id)
        .populate('messages.sender', 'name email')
        .then(chat => chat.messages[chat.messages.length - 1]);

    res.status(201).json(populatedMessage);
});

// @desc    Mark messages as read
// @route   PUT /api/chats/:id/read
// @access  Private
const markMessagesAsRead = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
        res.status(404);
        throw new Error('Chat not found');
    }

    // Check if student is a participant
    const isParticipant = chat.participants.some(
        p => p.user.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
        res.status(403);
        throw new Error('Not authorized to access this chat');
    }

    // Mark all unread messages as read
    chat.messages.forEach(message => {
        const isRead = message.readBy.some(
            read => read.user.toString() === req.user._id.toString()
        );

        if (!isRead) {
            message.readBy.push({
                user: req.user._id,
                userType: 'Student',
                readAt: new Date()
            });
        }
    });

    await chat.save();

    res.json({ message: 'Messages marked as read' });
});

module.exports = {
    getCourseChats,
    getChatById,
    sendMessage,
    markMessagesAsRead
}; 