const express = require('express');
const Review = require('../models/Review');
const Complaint = require('../models/Complaint');
const Official = require('../models/Official');

const router = express.Router();
const auth = require('../middleware/auth');

// Submit a review
router.post('/', async (req, res) => {
  try {
    const { complaintId, citizenEmail, rating, comment, isAnonymous } = req.body;

    // Check if complaint exists and is public
    const complaint = await Complaint.findById(complaintId)
      .populate('assignedOfficial');
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (!complaint.isPublic) {
      return res.status(400).json({ message: 'Complaint is not yet public for review' });
    }

    if (!complaint.assignedOfficial) {
      return res.status(400).json({ message: 'No official assigned to this complaint' });
    }

    // Check if user has already reviewed this complaint
    const existingReview = await Review.findOne({ 
      complaint: complaintId, 
      citizenEmail 
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this complaint' });
    }

    // Calculate response time
    const responseTime = complaint.resolvedAt 
      ? (complaint.resolvedAt - complaint.submittedAt) / (1000 * 60 * 60) // in hours
      : (new Date() - complaint.submittedAt) / (1000 * 60 * 60);

    const review = new Review({
      complaint: complaintId,
      official: complaint.assignedOfficial._id,
      citizenEmail,
      rating,
      comment,
      responseTime,
      isAnonymous
    });

    await review.save();

    // Update official's performance score
    await updateOfficialPerformance(complaint.assignedOfficial._id);

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

// Get reviews for a specific official
router.get('/official/:officialId', auth, async (req, res) => {
  try {
    const { officialId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ official: officialId })
      .populate('complaint', 'title issueType submittedAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ official: officialId });

    // Calculate average rating
    const allReviews = await Review.find({ official: officialId });
    const averageRating = allReviews.length > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
      : 0;

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      averageRating: Math.round(averageRating * 100) / 100
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Get reviews for a specific complaint
router.get('/complaint/:complaintId', async (req, res) => {
  try {
    const reviews = await Review.find({ complaint: req.params.complaintId })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching complaint reviews:', error);
    res.status(500).json({ message: 'Error fetching complaint reviews' });
  }
});

// Get all public reviews
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const reviews = await Review.find()
      .populate('complaint', 'title issueType location.ward')
      .populate('official', 'name ward department')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments();

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching public reviews:', error);
    res.status(500).json({ message: 'Error fetching public reviews' });
  }
});

// Get leaderboard of best performing officials
router.get('/leaderboard', async (req, res) => {
  try {
    const officials = await Official.find({ isActive: true })
      .select('name ward department performanceScore totalComplaints resolvedComplaints')
      .sort({ performanceScore: -1 })
      .limit(10);

    res.json(officials);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Helper function to update official performance
async function updateOfficialPerformance(officialId) {
  try {
    const reviews = await Review.find({ official: officialId });
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    const totalComplaints = await Complaint.countDocuments({ assignedOfficial: officialId });
    const resolvedComplaints = await Complaint.countDocuments({ 
      assignedOfficial: officialId, 
      status: 'resolved' 
    });

    await Official.findByIdAndUpdate(officialId, {
      performanceScore: Math.round(averageRating * 100) / 100,
      totalComplaints,
      resolvedComplaints
    });
  } catch (error) {
    console.error('Error updating official performance:', error);
  }
}

module.exports = router;
