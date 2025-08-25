const mongoose = require('mongoose');

const communityMessageSchema = new mongoose.Schema({
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  senderName: { type: String, required: true },
  messageType: { type: String, enum: ['text', 'note', 'video'], default: 'text' },
  content: { type: String }, // For text messages
  file: { // For note/video uploads
    originalName: String,
    url: String,
    fileType: String,
    size: Number,
  }
}, { timestamps: true });

module.exports = mongoose.model('CommunityMessage', communityMessageSchema);