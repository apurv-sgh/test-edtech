const mongoose = require('mongoose');

const OptionSchema = mongoose.Schema({
    _id: false,
    value: {
        type: String,
        required: true
    },
});

const QuestionSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['multiple-choice', 'short-answer', 'essay', 'true-false']
    },
    // FIX 1: Change 'questoin' to 'question'
    question: {
        type: String,
        required: true
    },
    options: [OptionSchema],
    correctAnswer: {
        type: mongoose.Schema.Types.Mixed,
    },
    points: {
        type: Number,
        required: true,
        default: 1
    },
});

const QuestionPaperSchema = mongoose.Schema({
    paperTitle: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    instructions: {
        type: String,
    },
    // FIX 2: Change 'questoins' to 'questions'
    questions: [QuestionSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // FIX 3: Make 'user' not required for now, or ensure a default/dummy ID is provided
        // Remove `required: true` if you're not implementing user auth yet
        // required: true
        default: '1' // Example dummy ObjectId, replace with a valid one if needed
        // Or better, if not using auth, remove this field for now.
    },
},
{
    timestamps: true,
});

const QuestionPaper = mongoose.model('QuestionPaper', QuestionPaperSchema);

module.exports = QuestionPaper;