const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswerIndex: { type: Number, required: true }
}, { _id: false });

const QuizSchema = new mongoose.Schema({
      title: {
            type: String,
            required: true,
      },
      course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
      },
      questions: [QuestionSchema],
      createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
      },
      createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', QuizSchema);
// This code defines a Mongoose schema for a Quiz model, including fields for title, course reference, questions, created by student reference, and createdAt timestamp. The schema is then exported as a Mongoose model. This model can be used to manage quizzes associated with courses in an educational application.