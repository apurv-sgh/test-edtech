const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model (students)
    required: true
  },
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model (counsellors)
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'cashfree'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true
  },
  gatewayTransactionId: {
    type: String // External payment gateway transaction ID
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed // Store full response from payment gateway
  },
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    upiId: String,
    bankName: String
  },
  refundDetails: {
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,
    refundTransactionId: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed // Additional payment metadata
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate transaction ID
paymentSchema.pre('save', function(next) {
  if (!this.transactionId) {
    this.transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
paymentSchema.index({ booking: 1 });
paymentSchema.index({ student: 1 });
paymentSchema.index({ counsellor: 1 });
paymentSchema.index({ paymentStatus: 1 });
paymentSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Payment', paymentSchema, 'payments');
