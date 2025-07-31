require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/breeds', require('./routes/breedRoutes'));
app.use('/api/feeds', require('./routes/feedRoutes'));
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/milk', require('./routes/milkRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.send('Dairy Farmers Management System API');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

// Initialize admin user function
const initializeAdmin = async () => {
  try {
    const Farmer = require('./models/Farmer');
    const bcrypt = require('bcryptjs');
    
    const adminExists = await Farmer.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Farmer.create({
        name: 'System Admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        farmName: 'System',
        location: 'System',
        role: 'admin'
      });
      console.log('Admin account created successfully');
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    await initializeAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
