// api/officials/login.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://prajapatthanaram31_db_user:kwotASsoH8OFEX6K@cluster0.upcbnnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Official Schema
const officialSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['ward-officer', 'supervisor', 'admin'], default: 'ward-officer' },
  ward: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  performanceScore: { type: Number, default: 0, min: 0, max: 5 },
  totalComplaints: { type: Number, default: 0 },
  resolvedComplaints: { type: Number, default: 0 },
  averageResolutionTime: { type: Number, default: 0 }
}, { timestamps: true });

// Hash password before saving
officialSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
officialSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Official = mongoose.models.Official || mongoose.model('Official', officialSchema);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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
};
