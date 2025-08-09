const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
    },
    duration: {
        type: Number, // in minutes
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    materials: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ['pdf', 'video', 'link', 'image']
        }
    }]
}, {
    timestamps: true
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    duration: {
        type: Number, // in hours
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }],
    lessons: [lessonSchema],
    tests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test'
    }],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    reviews: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        rating: {
      type: Number,
      required: true
    },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Check if the model exists before creating it
module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema); 