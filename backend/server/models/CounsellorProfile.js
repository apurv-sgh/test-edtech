const mongoose = require('mongoose');

const CounsellorProfileSchema = new mongoose.Schema({
  counsellor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  linkedinUrl: { type: String, required: true },
  currentCompany: { type: String },
  experience: { type: Number, required: true },
  availableTime: { type: String, required: true },
  skills: { type: [String], required: true },
  bio: { type: String, required: true },
  profilePicture: { type: String },
  topics: [{ type: String }],
  sessionPrice: { type: Number, required: true },
  sessionDuration: { type: String, required: true },
  bannerImage: { type: String },
  // Rating and review fields
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CounsellorProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CounsellorProfile', CounsellorProfileSchema, 'counsellorprofiles'); 