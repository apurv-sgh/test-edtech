
const mongoose = require('mongoose');

const LiveSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended', 'cancelled'],
    default: 'scheduled'
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  maxParticipants: {
    type: Number,
    default: 100
  },
  roomId: {
    type: String,
    unique: true,
    required: true
  },
  recordingUrl: {
    type: String
  },
  isRecording: {
    type: Boolean,
    default: false
  },
  chatEnabled: {
    type: Boolean,
    default: true
  },
  screenShareEnabled: {
    type: Boolean,
    default: true
  },
  whiteboard: {
    enabled: {
      type: Boolean,
      default: false
    },
    data: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LiveSession', LiveSessionSchema);
