const mongoose = require('mongoose');

const channelMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
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
    messageType: {
        type: String,
        enum: ['text', 'image', 'file'],
        default: 'text'
    },
    attachments: [{
        type: String,
        url: String,
        filename: String,
        size: Number
    }],
    readBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId
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

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userType: {
            type: String,
            enum: ['Student', 'Teacher'],
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ['member', 'admin'],
            default: 'member'
        }
    }],
    messages: [channelMessageSchema],
    lastMessage: channelMessageSchema,
    tags: [{
        type: String,
        trim: true
    }],
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'All Levels'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    memberCount: {
        type: Number,
        default: 0
    },
    messageCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better search performance
channelSchema.index({ subject: 1, name: 1 });
channelSchema.index({ instructor: 1 });
channelSchema.index({ tags: 1 });
channelSchema.index({ isActive: 1, isPublic: 1 });

// Update member count when members change
channelSchema.pre('save', function(next) {
    this.memberCount = this.members.length;
    this.messageCount = this.messages.length;
    next();
});

module.exports = mongoose.model('Channel', channelSchema); 