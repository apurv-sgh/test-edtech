const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
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
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'document', 'pdf'],
        default: 'text'
    },
    attachments: [{
        type: String, // 'image', 'file', 'document', 'pdf'
        url: String,
        filename: String,
        size: Number,
        originalName: String
    }],
    isDoubt: {
        type: Boolean,
        default: false
    },
    doubtType: {
        type: String,
        enum: ['concept', 'problem', 'clarification', 'general'],
        default: 'general'
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'resolvedByType'
    },
    resolvedByType: {
        type: String,
        enum: ['Student', 'Teacher']
    },
    resolvedAt: {
        type: Date
    },
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
    }],
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'likes.userType'
        },
        userType: {
            type: String,
            enum: ['Student', 'Teacher']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    replies: [{
        content: String,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'replies.senderType'
        },
        senderType: {
            type: String,
            enum: ['Student', 'Teacher']
        },
        messageType: {
            type: String,
            enum: ['text', 'image', 'file', 'document', 'pdf'],
            default: 'text'
        },
        attachments: [{
            type: String,
            url: String,
            filename: String,
            size: Number,
            originalName: String
        }],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

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
    // Chat-like messages for real-time discussion
    messages: [messageSchema],
    lastMessage: messageSchema,
    // Traditional forum-style comments
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
    },
    // Discussion statistics
    messageCount: {
        type: Number,
        default: 0
    },
    doubtCount: {
        type: Number,
        default: 0
    },
    resolvedDoubtCount: {
        type: Number,
        default: 0
    },
    participantCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for better performance
discussionSchema.index({ course: 1, createdAt: -1 });
discussionSchema.index({ 'messages.isDoubt': 1 });
discussionSchema.index({ 'messages.sender': 1 });
discussionSchema.index({ isPinned: -1, createdAt: -1 });

// Update statistics when messages change
discussionSchema.pre('save', function(next) {
    if (this.messages) {
        this.messageCount = this.messages.length;
        this.doubtCount = this.messages.filter(msg => msg.isDoubt).length;
        this.resolvedDoubtCount = this.messages.filter(msg => msg.isDoubt && msg.isResolved).length;
        
        // Count unique participants
        const participants = new Set();
        this.messages.forEach(msg => {
            participants.add(msg.sender.toString());
        });
        this.participantCount = participants.size;
    }
    next();
});

module.exports = mongoose.model('Discussion', discussionSchema); 