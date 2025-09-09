 // server/models/Complaint.js

const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  issueType: {
    type: String,
    required: [true, 'Issue type is required'],
    trim: true,
    lowercase: true
  },
  location: {
    address: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    ward: {
      type: String,
      required: [true, 'Ward is required'],
      trim: true
    },
    area: {
      type: String,
      trim: true
    }
  },
  imageUrl: {
    type: String
  },
  citizenEmail: {
    type: String,
    trim: true
  },
  citizenPhone: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected', 'delayed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedOfficial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Official',
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  publicAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Normalize status to lowercase and ensure hyphen format where applicable
ComplaintSchema.pre('save', function (next) {
  if (this.status) {
    this.status = String(this.status).toLowerCase();
  }
  if (!this.submittedAt) {
    this.submittedAt = this.createdAt || new Date();
  }
  next();
});

// Helpful indexes for dashboards and filters
ComplaintSchema.index({ 'location.ward': 1, status: 1, issueType: 1 });
ComplaintSchema.index({ submittedAt: -1 });
ComplaintSchema.index({ assignedOfficial: 1 });

module.exports = mongoose.model('Complaint', ComplaintSchema);
