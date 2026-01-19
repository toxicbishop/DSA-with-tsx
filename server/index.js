require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Issue = require('./models/Issue');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins (for debugging)
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

// Auth Middleware (Level 1)
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid API Key' });
  }
  next();
};

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => {
  res.send('DSA Study Hub API is running');
});

// POST: Create a new issue/suggestion
app.post('/api/issues', validateApiKey, async (req, res) => {
  try {
    const { type, severity, title, description } = req.body;
    
    const newIssue = new Issue({
      type,
      severity,
      title,
      description
    });

    const savedIssue = await newIssue.save();
    res.status(201).json({ success: true, data: savedIssue });
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server Error', 
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});


// GET: Fetch all issues (admin, password required)
app.get('/api/issues', async (req, res) => {
  const adminPassword = process.env.VITE_ADMIN_PASSWORD;
  // Accept password via header or query param
  const providedPassword = req.headers['x-admin-password'] || req.query.password;
  if (!providedPassword || providedPassword !== adminPassword) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid admin password' });
  }
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json({ success: true, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
