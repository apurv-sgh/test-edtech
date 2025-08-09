const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientModel',
    required: true
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ['Student', 'User'] // Student for students, User for experts/counsellors
  },
  type: {
    type: String,
    enum: ['webinar_reminder', 'registration_confirmation', 'webinar_cancelled', 'attendance_reminder', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  // For webinar-related notifications
  webinarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryExpertProfile'
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // This references the User model exported from Counsellor.js
  },
  // Status tracking
  read: {
    type: Boolean,
    default: false
  },
  // Timestamps
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ recipient: 1, read: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ type: 1, webinarId: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};



// Static method to create webinar reminder
notificationSchema.statics.createWebinarReminder = async function(registrationId, reminderType) {
  const WebinarRegistration = require('./WebinarRegistration');
  
  const registration = await WebinarRegistration.findById(registrationId)
    .populate('studentId', 'name email')
    .populate('expertId', 'name')
    .populate('webinarId', 'seminars');

  if (!registration) return null;

  const webinar = registration.webinarId.seminars.find(s => s._id.toString() === registration.webinarId.toString());
  if (!webinar) return null;

  let scheduledFor, title, message;
  
  switch (reminderType) {
    case '24h':
      scheduledFor = new Date(webinar.date + 'T' + webinar.time);
      scheduledFor.setHours(scheduledFor.getHours() - 24);
      title = 'Webinar Tomorrow!';
      message = `Don't forget! Your webinar "${webinar.title}" is tomorrow at ${webinar.time}.`;
      break;
    case '1h':
      scheduledFor = new Date(webinar.date + 'T' + webinar.time);
      scheduledFor.setHours(scheduledFor.getHours() - 1);
      title = 'Webinar in 1 Hour!';
      message = `Your webinar "${webinar.title}" starts in 1 hour. Get ready!`;
      break;
    case '15min':
      scheduledFor = new Date(webinar.date + 'T' + webinar.time);
      scheduledFor.setMinutes(scheduledFor.getMinutes() - 15);
      title = 'Webinar Starting Soon!';
      message = `Your webinar "${webinar.title}" starts in 15 minutes. Join now!`;
      break;
  }

  const notification = new this({
    recipient: registration.studentId._id,
    recipientModel: 'Student',
    type: 'webinar_reminder',
    title,
    message,
    data: {
      webinarId: registration.webinarId._id,
      expertId: registration.expertId._id,
      webinarTitle: webinar.title,
      webinarDate: webinar.date,
      webinarTime: webinar.time,
      expertName: registration.expertId.name,
      reminderType
    },
    webinarId: registration.webinarId._id,
    expertId: registration.expertId._id,
    scheduledFor
  });

  return notification.save();
};

// Static method to create registration confirmation
notificationSchema.statics.createRegistrationConfirmation = async function(registrationId) {
  const WebinarRegistration = require('./WebinarRegistration');
  
  const registration = await WebinarRegistration.findById(registrationId)
    .populate('studentId', 'name email')
    .populate('expertId', 'name')
    .populate('webinarId', 'seminars');

  if (!registration) return null;

  const webinar = registration.webinarId.seminars.find(s => s._id.toString() === registration.webinarId.toString());
  if (!webinar) return null;

  const notification = new this({
    recipient: registration.studentId._id,
    recipientModel: 'Student',
    type: 'registration_confirmation',
    title: 'Registration Confirmed!',
    message: `You're successfully registered for "${webinar.title}" on ${webinar.date} at ${webinar.time}.`,
    data: {
      webinarId: registration.webinarId._id,
      expertId: registration.expertId._id,
      webinarTitle: webinar.title,
      webinarDate: webinar.date,
      webinarTime: webinar.time,
      expertName: registration.expertId.name
    },
    webinarId: registration.webinarId._id,
    expertId: registration.expertId._id
  });

  return notification.save();
};

// Static method to get unread notifications for a user
notificationSchema.statics.getUnreadNotifications = async function(userId, userModel = 'Student') {
  return this.find({
    recipient: userId,
    recipientModel: userModel,
    read: false
  }).sort({ createdAt: -1 });
};

// Static method to mark all notifications as read
notificationSchema.statics.markAllAsRead = async function(userId, userModel = 'Student') {
  return this.updateMany(
    {
      recipient: userId,
      recipientModel: userModel,
      read: false
    },
    {
      read: true,
      readAt: new Date()
    }
  );
};

module.exports = mongoose.model('Notification', notificationSchema); 