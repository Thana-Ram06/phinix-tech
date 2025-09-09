const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Official = require('../models/Official');
const Complaint = require('../models/Complaint');
const Review = require('../models/Review');

const router = express.Router();

// Register new official
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, ward, phone, department, role } = req.body;

    // Check if official already exists
    const existingOfficial = await Official.findOne({ email });
    if (existingOfficial) {
      return res.status(400).json({ message: 'Official already exists' });
    }

    const official = new Official({
      name,
      email,
      password,
      ward,
      phone,
      department,
      role
    });

    await official.save();

    res.status(201).json({
      message: 'Official registered successfully',
      official: {
        id: official._id,
        name: official.name,
        email: official.email,
        ward: official.ward,
        department: official.department,
        role: official.role
      }
    });
  } catch (error) {
    console.error('Error registering official:', error);
    res.status(500).json({ message: 'Error registering official' });
  }
});

// Login official
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const official = await Official.findOne({ email, isActive: true });
    if (!official) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await official.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: official._id, email: official.email, role: official.role },
      process.env.JWT_SECRET || 'civicpulse_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      official: {
        id: official._id,
        name: official.name,
        email: official.email,
        ward: official.ward,
        department: official.department,
        role: official.role,
        performanceScore: official.performanceScore
      }
    });
  } catch (error) {
    console.error('Error logging in official:', error);
    res.status(500).json({ message: 'Error logging in official' });
  }
});

const auth = require('../middleware/auth');

// Get official dashboard data
router.get('/:id/dashboard', auth, async (req, res) => {
  try {
    const official = await Official.findById(req.params.id);
    if (!official) {
      return res.status(404).json({ message: 'Official not found' });
    }

    // Get complaints assigned to this official
    const complaints = await Complaint.find({ assignedOfficial: req.params.id })
      .sort({ submittedAt: -1 });

    // Calculate statistics
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(c => c.status === 'pending').length;
    const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
    const delayedComplaints = complaints.filter(c => c.status === 'delayed').length;

    // Calculate average resolution time
    const resolvedComplaintsWithTime = complaints.filter(c => c.resolvedAt);
    const totalResolutionTime = resolvedComplaintsWithTime.reduce((sum, c) => {
      const resolutionTime = (c.resolvedAt - c.submittedAt) / (1000 * 60 * 60); // in hours
      return sum + resolutionTime;
    }, 0);
    const averageResolutionTime = resolvedComplaintsWithTime.length > 0 
      ? totalResolutionTime / resolvedComplaintsWithTime.length 
      : 0;

    // Get recent reviews
    const reviews = await Review.find({ official: req.params.id })
      .populate('complaint', 'title issueType')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      official: {
        id: official._id,
        name: official.name,
        ward: official.ward,
        department: official.department,
        performanceScore: official.performanceScore
      },
      statistics: {
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        delayedComplaints,
        averageResolutionTime: Math.round(averageResolutionTime * 100) / 100
      },
      recentReviews: reviews
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get all officials (for admin)
router.get('/', auth, async (req, res) => {
  try {
    const officials = await Official.find({ isActive: true })
      .select('-password')
      .sort({ performanceScore: -1 });

    res.json(officials);
  } catch (error) {
    console.error('Error fetching officials:', error);
    res.status(500).json({ message: 'Error fetching officials' });
  }
});

// Update official performance score
router.patch('/:id/performance', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Calculate new performance score based on reviews
    const reviews = await Review.find({ official: id });
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    const official = await Official.findByIdAndUpdate(
      id,
      { 
        performanceScore: Math.round(averageRating * 100) / 100,
        totalComplaints: await Complaint.countDocuments({ assignedOfficial: id }),
        resolvedComplaints: await Complaint.countDocuments({ 
          assignedOfficial: id, 
          status: 'resolved' 
        })
      },
      { new: true }
    ).select('-password');

    res.json(official);
  } catch (error) {
    console.error('Error updating performance:', error);
    res.status(500).json({ message: 'Error updating performance' });
  }
});

module.exports = router;
