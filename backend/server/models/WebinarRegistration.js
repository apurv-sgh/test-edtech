const mongoose = require('mongoose');

const webinarRegistrationSchema = new mongoose.Schema({
  webinarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryExpertProfile',
    required: true
  },
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  // Registration details
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  institution: {
    type: String,
    trim: true
  },
  yearOfStudy: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Working Professional', 'Other'],
    required: true
  },
  expectations: {
    type: String,
    required: true,
    trim: true
  },
  questions: {
    type: String,
    trim: true
  },
  // Status tracking
  status: {
    type: String,
    enum: ['registered', 'attended', 'cancelled', 'no-show'],
    default: 'registered'
  },
  // Timestamps
  registeredAt: {
    type: Date,
    default: Date.now
  },
  attendedAt: {
    type: Date
  },
  // Analytics
  source: {
    type: String,
    enum: ['profile', 'dashboard', 'email', 'social'],
    default: 'profile'
  },
  // Reminder tracking
  remindersSent: [{
    type: {
      type: String,
      enum: ['24h', '1h', '15min']
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
webinarRegistrationSchema.index({ webinarId: 1, studentId: 1 }, { unique: true });
webinarRegistrationSchema.index({ expertId: 1, status: 1 });
webinarRegistrationSchema.index({ registeredAt: 1 });

// Virtual for calculating days until webinar
webinarRegistrationSchema.virtual('daysUntilWebinar').get(function() {
  // This would be calculated based on the webinar date
  return 0; // Placeholder
});

// Method to mark as attended
webinarRegistrationSchema.methods.markAsAttended = function() {
  this.status = 'attended';
  this.attendedAt = new Date();
  return this.save();
};

// Method to send reminder
webinarRegistrationSchema.methods.addReminder = function(type) {
  this.remindersSent.push({
    type,
    sentAt: new Date()
  });
  return this.save();
};

// Static method to get registration stats for an expert
webinarRegistrationSchema.statics.getExpertStats = async function(expertId) {
  const stats = await this.aggregate([
    { $match: { expertId: new mongoose.Types.ObjectId(expertId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    registered: 0,
    attended: 0,
    cancelled: 0,
    noShow: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });
  
  return result;
};

// Static method to get webinar registration count
webinarRegistrationSchema.statics.getWebinarRegistrationCount = async function(webinarId) {
  const count = await this.countDocuments({ 
    webinarId, 
    status: { $in: ['registered', 'attended'] } 
  });
  return count;
};

module.exports = mongoose.model('WebinarRegistration', webinarRegistrationSchema); 