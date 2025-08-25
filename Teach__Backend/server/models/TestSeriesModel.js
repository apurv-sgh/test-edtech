const mongoose = require('mongoose');

const TestSeriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category']
  },
  questions: {
    type: Number,
    required: [true, 'Please provide the number of questions']
  },
  duration: {
    type: String, // e.g., "180 mins"
    required: [true, 'Please provide the duration']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher', // Assumes you have a Teacher model
    // required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('TestSeries', TestSeriesSchema);