const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  counsellorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CounsellorProfile',
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
    enum: ['career_counselling', 'academic_guidance', 'personal_counselling', 'other'],
    default: 'career_counselling'
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
reviewSchema.index({ counsellorId: 1, createdAt: -1 });
reviewSchema.index({ studentId: 1, counsellorId: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Virtual for calculating average rating
reviewSchema.statics.getAverageRating = async function(counsellorId) {
  const result = await this.aggregate([
    {
      $match: {
        counsellorId: new mongoose.Types.ObjectId(counsellorId),
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

// Method to check if student has already reviewed this counsellor
reviewSchema.statics.hasStudentReviewed = async function(counsellorId, studentId) {
  const review = await this.findOne({
    counsellorId,
    studentId,
    status: { $in: ['pending', 'approved'] }
  });
  return !!review;
};

// Pre-save middleware to update counsellor's average rating
reviewSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('rating') || this.isModified('status')) {
    const CounsellorProfile = require('./CounsellorProfile');
    const stats = await this.constructor.getAverageRating(this.counsellorId);
    
    await CounsellorProfile.findByIdAndUpdate(this.counsellorId, {
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews
    });
  }
  next();
});

module.exports = mongoose.model('Review', reviewSchema); 