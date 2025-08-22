const mongoose = require('mongoose');

const expertReviewSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IndustryExpertProfile',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  sessionType: {
    type: String,
    enum: ['seminar', 'consultation', 'mentorship', 'other'],
    default: 'consultation'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  helpful: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    helpful: {
      type: Boolean,
      default: true
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
expertReviewSchema.index({ expertId: 1, createdAt: -1 });
expertReviewSchema.index({ studentId: 1, expertId: 1 }, { unique: true });
expertReviewSchema.index({ rating: 1 });
expertReviewSchema.index({ status: 1 });

// Virtual for calculating average rating
expertReviewSchema.statics.getAverageRating = async function(expertId) {
  const result = await this.aggregate([
    {
      $match: {
        expertId: new mongoose.Types.ObjectId(expertId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews
  } : { averageRating: 0, totalReviews: 0 };
};

// Method to check if student has already reviewed this expert
expertReviewSchema.statics.hasStudentReviewed = async function(expertId, studentId) {
  const review = await this.findOne({
    expertId,
    studentId,
    status: { $in: ['pending', 'approved'] }
  });
  return !!review;
};

// Pre-save middleware to update expert's average rating
expertReviewSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('rating') || this.isModified('status')) {
    const IndustryExpertProfile = require('./IndustryExpertProfile');
    const stats = await this.constructor.getAverageRating(this.expertId);
    
    await IndustryExpertProfile.findByIdAndUpdate(this.expertId, {
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews
    });
  }
  next();
});

module.exports = mongoose.model('ExpertReview', expertReviewSchema); 