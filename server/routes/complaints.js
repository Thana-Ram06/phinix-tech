const express = require('express');
const multer = require('multer');
const path = require('path');
const Complaint = require('../models/Complaint');
const Official = require('../models/Official');

const router = express.Router();
const auth = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Submit a new complaint
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, issueType, location, citizenEmail, citizenPhone } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    let locationData = location;
    if (typeof location === 'string') {
      try {
        locationData = JSON.parse(location);
      } catch (_) {
        return res.status(400).json({ message: 'Invalid location format' });
      }
    }
    if (!locationData || !locationData.ward) {
      return res.status(400).json({ message: 'Ward is required in location' });
    }

    // Find the appropriate official for this ward
    const official = await Official.findOne({ 
      ward: locationData.ward,
      isActive: true 
    });

    const complaint = new Complaint({
      title,
      description,
      issueType,
      location: locationData,
      imageUrl,
      citizenEmail,
      citizenPhone,
      assignedOfficial: official ? official._id : null
    });

    await complaint.save();

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: complaint
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Error submitting complaint' });
  }
});

// Get all complaints (for admin dashboard)
router.get('/', auth, async (req, res) => {
  try {
    const { ward, status, issueType, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (ward) filter['location.ward'] = ward;
    if (status) filter.status = status;
    if (issueType) filter.issueType = issueType;

    const complaints = await Complaint.find(filter)
      .populate('assignedOfficial', 'name email ward department')
      .sort({ submittedAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});

// Get public complaints (for citizen review)
router.get('/public', async (req, res) => {
  try {
    const complaints = await Complaint.find({ 
      isPublic: true,
      status: { $in: ['resolved', 'delayed'] }
    })
      .populate('assignedOfficial', 'name ward department')
      .sort({ publicAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error('Error fetching public complaints:', error);
    res.status(500).json({ message: 'Error fetching public complaints' });
  }
});

// Update complaint status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('assignedOfficial', 'name email ward department');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Error updating complaint status' });
  }
});

// Get complaint by ID
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('assignedOfficial', 'name email ward department');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: 'Error fetching complaint' });
  }
});

// Mark delayed complaints as public
router.post('/mark-delayed-public', async (req, res) => {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    
    const delayedComplaints = await Complaint.updateMany(
      {
        status: 'pending',
        submittedAt: { $lt: threeDaysAgo },
        isPublic: false
      },
      {
        $set: {
          status: 'delayed',
          isPublic: true,
          publicAt: new Date()
        }
      }
    );

    res.json({ 
      message: 'Delayed complaints marked as public',
      count: delayedComplaints.modifiedCount
    });
  } catch (error) {
    console.error('Error marking delayed complaints:', error);
    res.status(500).json({ message: 'Error marking delayed complaints' });
  }
});

module.exports = router;
