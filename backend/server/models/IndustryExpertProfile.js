const mongoose = require('mongoose');

const SeminarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  fee: { type: Number, default: 0 }, // 0 = free
});

const IndustryExpertProfileSchema = new mongoose.Schema({
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  linkedinUrl: { type: String, required: true },
  currentCompany: { type: String,},
  experience: { type: Number, required: true },
  domain: { type: String, },
  skills: { type: [String], required: true },
  bio: { type: String, required: true },
  seminars: [SeminarSchema],
  // Rating and review fields
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

IndustryExpertProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('IndustryExpertProfile', IndustryExpertProfileSchema); 