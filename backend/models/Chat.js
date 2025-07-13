const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderType',
        required: true
    },
    senderType: {
        type: String,
        enum: ['Student', 'Teacher'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    attachments: [{
        type: String,
        url: String
    }],
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'readBy.userType'
        },
        userType: {
            type: String,
            enum: ['Student', 'Teacher']
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const chatSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'participants.userType'
        },
        userType: {
            type: String,
            enum: ['Student', 'Teacher']
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    messages: [messageSchema],
    isGroupChat: {
        type: Boolean,
        default: true
    },
    lastMessage: messageSchema,
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema); 