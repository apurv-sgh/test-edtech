const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'authorType',
        required: true
    },
    authorType: {
        type: String,
        enum: ['Student', 'Teacher'],
        required: true
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'likes.userType'
        },
        userType: {
            type: String,
            enum: ['Student', 'Teacher']
        }
    }],
    replies: [{
        content: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'replies.authorType'
        },
        authorType: {
            type: String,
            enum: ['Student', 'Teacher']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const discussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'authorType',
        required: true
    },
    authorType: {
        type: String,
        enum: ['Student', 'Teacher'],
        required: true
    },
    tags: [{
        type: String
    }],
    comments: [commentSchema],
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'likes.userType'
        },
        userType: {
            type: String,
            enum: ['Student', 'Teacher']
        }
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    isClosed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Discussion', discussionSchema); 