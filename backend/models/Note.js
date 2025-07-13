const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
      title: {
            type: String,
            required: true,
      },
      course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
      },
      filePath: {
            type: String,
            required: true,
      },
      fileName: {
            type: String,
            required: true,
      },
      uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
      },
      uploadDate: {
            type: Date,
            default: Date.now,
      }
});

module.exports = mongoose.model('Note', NoteSchema);
// This code defines a Mongoose schema for a Note model, including fields for title, course reference, file path, file name, uploaded by student reference, and upload date. The schema is then exported as a Mongoose model. This model can be used to manage notes associated with courses in an educational application.