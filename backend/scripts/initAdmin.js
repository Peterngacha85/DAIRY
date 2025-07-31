require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const Farmer = require(path.join(__dirname, '..', 'models', 'Farmer'));

async function initializeAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);

    // Check if admin already exists
    const adminExists = await Farmer.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) {
      console.log('Admin account already exists');
      process.exit(0);
    }

    // Create admin account
    console.log('Creating admin account...');
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
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error);
    process.exit(1);
  }
}

initializeAdmin();
