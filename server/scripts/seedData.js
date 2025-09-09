const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Official = require('../models/Official');
const Complaint = require('../models/Complaint');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/civicpulse';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log(`Seeding DB: Connected to ${mongoUri}`);
});

mongoose.connection.on('error', (err) => {
  console.error('Seeding DB: Connection error:', err);
});

const seedData = async () => {
  try {
    // Clear existing data
    await Official.deleteMany({});
    await Complaint.deleteMany({});

    // Create demo officials
    const officials = await Official.create([
      {
        name: 'THANA RAM',
        email: 'thana@civicpulse.com',
        password: 'ram123',
        ward: 'Ward 1',
        phone: '+1-555-0101',
        department: 'Public Works',
        role: 'ward-officer',
        performanceScore: 4.2
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@civicpulse.com',
        password: 'password123',
        ward: 'Ward 2',
        phone: '+1-555-0102',
        department: 'Sanitation',
        role: 'ward-officer',
        performanceScore: 4.8
      },
      {
        name: 'Mike Davis',
        email: 'mike.davis@civicpulse.com',
        password: 'password123',
        ward: 'Ward 3',
        phone: '+1-555-0103',
        department: 'Infrastructure',
        role: 'ward-officer',
        performanceScore: 3.5
      }
    ]);

    // Create demo complaints
    const complaints = await Complaint.create([
      {
        title: 'Large Pothole on Main Street',
        description: 'There is a large pothole on Main Street that is causing damage to vehicles. It has been there for over a week and needs immediate attention.',
        issueType: 'pothole',
        location: {
          address: '123 Main Street, Downtown',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          ward: 'Ward 1'
        },
        imageUrl: '/uploads/demo-pothole.jpg',
        status: 'resolved',
        priority: 'high',
        assignedOfficial: officials[0]._id,
        citizenEmail: 'citizen1@example.com',
        citizenPhone: '+1-555-1001',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isPublic: true,
        publicAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Garbage Not Collected',
        description: 'Garbage collection was missed on our street this week. The bins are overflowing and creating a health hazard.',
        issueType: 'garbage',
        location: {
          address: '456 Oak Avenue, Residential Area',
          coordinates: { lat: 40.7589, lng: -73.9851 },
          ward: 'Ward 2'
        },
        imageUrl: '/uploads/demo-garbage.jpg',
        status: 'delayed',
        priority: 'medium',
        assignedOfficial: officials[1]._id,
        citizenEmail: 'citizen2@example.com',
        citizenPhone: '+1-555-1002',
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        isPublic: true,
        publicAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        title: 'Broken Streetlight',
        description: 'Streetlight on the corner of 5th and Elm has been out for several days. The area is very dark at night and unsafe for pedestrians.',
        issueType: 'streetlight',
        location: {
          address: '789 Elm Street, Corner of 5th',
          coordinates: { lat: 40.7505, lng: -73.9934 },
          ward: 'Ward 3'
        },
        imageUrl: '/uploads/demo-streetlight.jpg',
        status: 'pending',
        priority: 'medium',
        assignedOfficial: officials[2]._id,
        citizenEmail: 'citizen3@example.com',
        citizenPhone: '+1-555-1003',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        title: 'Water Leak on Sidewalk',
        description: 'There is a water leak coming from underground that is flooding the sidewalk. Water is pooling and making it difficult to walk.',
        issueType: 'water',
        location: {
          address: '321 Pine Street, Near Park',
          coordinates: { lat: 40.7614, lng: -73.9776 },
          ward: 'Ward 1'
        },
        imageUrl: '/uploads/demo-water-leak.jpg',
        status: 'in-progress',
        priority: 'high',
        assignedOfficial: officials[0]._id,
        citizenEmail: 'citizen4@example.com',
        citizenPhone: '+1-555-1004',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ]);

    console.log('✅ Demo data seeded successfully!');
    console.log(`Created ${officials.length} officials and ${complaints.length} complaints`);
    console.log('\nDemo Login Credentials:');
    console.log('Email: thana@civicpulse.com');
    console.log('Password: ram123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
