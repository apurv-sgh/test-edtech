const mongoose = require('mongoose');
const Review = require('../models/Review');
const ExpertReview = require('../models/ExpertReview');
const CounsellorProfile = require('../models/CounsellorProfile');
const IndustryExpertProfile = require('../models/IndustryExpertProfile');
const Student = require('../models/Student');

// Get reviews for a counsellor
const getCounsellorReviews = async (req, res) => {
  try {
    const { counsellorId } = req.params;
    const { page = 1, limit = 10, rating, sort = 'newest' } = req.query;

    if (!mongoose.Types.ObjectId.isValid(counsellorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid counsellor ID format'
      });
    }

    // Validate counsellor exists
    const counsellor = await CounsellorProfile.findById(counsellorId);
    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor not found'
      });
    }

    // Build query
    const query = {
      counsellorId,
      status: 'approved'
    };

    if (rating) {
      query.rating = parseInt(rating);
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'highest':
        sortOptions = { rating: -1 };
        break;
      case 'lowest':
        sortOptions = { rating: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get reviews with pagination
    const reviews = await Review.find(query)
      .populate('studentId', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Review.countDocuments(query);

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { counsellorId: new mongoose.Types.ObjectId(counsellorId), status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Format rating distribution
    const ratingStats = {};
    for (let i = 5; i >= 1; i--) {
      const found = ratingDistribution.find(r => r._id === i);
      ratingStats[i] = found ? found.count : 0;
    }

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        },
        ratingDistribution: ratingStats,
        averageRating: counsellor.averageRating,
        totalReviews: counsellor.totalReviews
      }
    });

  } catch (error) {
    console.error('Get counsellor reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews'
    });
  }
};

// Create a new review
const createReview = async (req, res) => {
  try {
    console.log('=== CREATE REVIEW DEBUG ===');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);
    
    const { counsellorId } = req.params;
    const { rating, comment, sessionType, isAnonymous } = req.body;
    const studentId = req.user._id || req.user.id;

    // Validate counsellor exists
    const counsellor = await CounsellorProfile.findById(counsellorId);
    if (!counsellor) {
      return res.status(404).json({
        success: false,
        message: 'Counsellor not found'
      });
    }

    // Check if student has already reviewed this counsellor
    const existingReview = await Review.hasStudentReviewed(counsellorId, studentId);
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this counsellor'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Validate comment
    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 10 characters long'
      });
    }

    // Create review
    const review = new Review({
      counsellorId,
      studentId,
      rating,
      comment: comment.trim(),
      sessionType: sessionType || 'career_counselling',
      isAnonymous: isAnonymous || false
    });

    await review.save();

    // Populate student info for response
    await review.populate('studentId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review'
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, sessionType, isAnonymous } = req.body;
    const studentId = req.user._id || req.user.id;

    // Find review and check ownership
    const review = await Review.findOne({
      _id: reviewId,
      studentId,
      status: { $in: ['pending', 'approved'] }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to edit it'
      });
    }

    // Update fields
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      if (!comment || comment.trim().length < 10) {
        return res.status(400).json({
          success: false,
          message: 'Comment must be at least 10 characters long'
        });
      }
      review.comment = comment.trim();
    }

    if (sessionType !== undefined) {
      review.sessionType = sessionType;
    }

    if (isAnonymous !== undefined) {
      review.isAnonymous = isAnonymous;
    }

    await review.save();
    await review.populate('studentId', 'name email');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const studentId = req.user._id || req.user.id;

    // Find review and check ownership
    const review = await Review.findOne({
      _id: reviewId,
      studentId,
      status: { $in: ['pending', 'approved'] }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not authorized to delete it'
      });
    }

    // Soft delete by changing status
    review.status = 'rejected';
    await review.save();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
};

// Mark review as helpful/unhelpful
const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body;
    const studentId = req.user._id || req.user.id;

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if student already marked this review
    const existingMark = review.helpful.find(h => h.studentId.toString() === studentId);

    if (existingMark) {
      // Update existing mark
      existingMark.helpful = helpful;
    } else {
      // Add new mark
      review.helpful.push({
        studentId,
        helpful
      });
    }

    await review.save();

    res.json({
      success: true,
      message: `Review marked as ${helpful ? 'helpful' : 'unhelpful'}`,
      data: {
        helpfulCount: review.helpful.filter(h => h.helpful).length,
        unhelpfulCount: review.helpful.filter(h => !h.helpful).length
      }
    });

  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review'
    });
  }
};

// Get student's reviews
const getStudentReviews = async (req, res) => {
  try {
    const studentId = req.user._id || req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({
      studentId,
      status: { $in: ['pending', 'approved'] }
    })
      .populate('counsellorId', 'counsellor')
      .populate('counsellorId.counsellor', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({
      studentId,
      status: { $in: ['pending', 'approved'] }
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total
        }
      }
    });

  } catch (error) {
    console.error('Get student reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get your reviews'
    });
  }
};

// ========== EXPERT REVIEW FUNCTIONS ==========

// Get reviews for an expert
const getExpertReviews = async (req, res) => {
  try {
    const { expertId } = req.params;
    const { page = 1, limit = 10, rating, sort = 'newest' } = req.query;

    // Validate expert exists
    const expert = await IndustryExpertProfile.findById(expertId);
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    // Build query
    const query = {
      expertId,
      status: 'approved'
    };

    if (rating) {
      query.rating = parseInt(rating);
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'highest':
        sortOptions = { rating: -1 };
        break;
      case 'lowest':
        sortOptions = { rating: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get reviews with pagination
    const reviews = await ExpertReview.find(query)
      .populate('studentId', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await ExpertReview.countDocuments(query);

    // Get rating distribution
    const ratingDistribution = await ExpertReview.aggregate([
      { $match: { expertId: new mongoose.Types.ObjectId(expertId), status: 'approved' } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    // Format rating distribution
    const ratingStats = {};
    for (let i = 5; i >= 1; i--) {
      const found = ratingDistribution.find(r => r._id === i);
      ratingStats[i] = found ? found.count : 0;
    }

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        },
        ratingDistribution: ratingStats,
        averageRating: expert.averageRating,
        totalReviews: expert.totalReviews
      }
    });

  } catch (error) {
    console.error('Get expert reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews'
    });
  }
};

// Create a review for an expert
const createExpertReview = async (req, res) => {
  try {
   
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);
    
    const { expertId } = req.params;
    const { rating, comment, sessionType, isAnonymous } = req.body;
    const studentId = req.user._id || req.user.id;
    
    console.log('Extracted data:', { expertId, rating, comment, sessionType, isAnonymous, studentId });

    // Validate expertId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(expertId)) {
      console.log('Invalid expertId format:', expertId);
      return res.status(400).json({
        success: false,
        message: 'Invalid expert ID format'
      });
    }

    // Validate expert exists
    console.log('Looking for expert with ID:', expertId);
    const expert = await IndustryExpertProfile.findById(expertId);
    console.log('Expert found:', expert ? 'Yes' : 'No');
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    // Validate studentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      console.log('Invalid studentId format:', studentId);
      return res.status(400).json({
        success: false,
        message: 'Invalid student ID format'
      });
    }

    // Check if student has already reviewed this expert
    console.log('Checking if student has already reviewed this expert...');
    const existingReview = await ExpertReview.hasStudentReviewed(expertId, studentId);
    console.log('Existing review found:', existingReview ? 'Yes' : 'No');
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this expert'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Validate comment
    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 10 characters long'
      });
    }

    // Create review
    const review = new ExpertReview({
      expertId,
      studentId,
      rating,
      comment: comment.trim(),
      sessionType: sessionType || 'consultation',
      isAnonymous: isAnonymous || false
    });

    await review.save();

    // Populate student info for response
    await review.populate('studentId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });

  } catch (error) {
    console.error('Create expert review error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

module.exports = {
  getCounsellorReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getStudentReviews,
  getExpertReviews,
  createExpertReview
}; 