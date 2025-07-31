require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Farmer = require('../models/Farmer');

async function initializeAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Check if admin already exists
    const adminExists = await Farmer.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Create admin account
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    const admin = await Farmer.create({
      name: 'System Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      farmName: 'System',
      location: 'System',
      role: 'admin'
    });

    console.log('Admin account created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
}

initializeAdmin();
