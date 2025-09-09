const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true
  },
  official: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Official',
    required: true
  },
  citizenEmail: {
    type: String,
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
    trim: true,
    maxlength: 500
  },
  responseTime: {
    type: Number, // in hours
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
reviewSchema.index({ official: 1 });
reviewSchema.index({ complaint: 1 });

module.exports = mongoose.model('Review', reviewSchema);
