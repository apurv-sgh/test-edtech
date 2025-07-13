const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true } 
}, { _id: false });

const TestSchema = new mongoose.Schema({
      title: { type: String, required: true },
      course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
      },
      questions: [QuestionSchema],
      duration: { type: Number, default: 60 }, // Duration in minutes
      createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
      },
      createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', TestSchema);