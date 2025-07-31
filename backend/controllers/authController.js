const Farmer = require('../models/Farmer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register farmer
exports.register = async (req, res) => {
  try {
    const { name, email, password, farmName, location } = req.body;
    if (!name || !email || !password || !farmName || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await Farmer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const farmer = await Farmer.create({
      name,
      email,
      password: hashed,
      farmName,
      location
    });
    const token = jwt.sign({ id: farmer._id, role: farmer.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { ...farmer._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const farmer = await Farmer.findOne({ email });
    if (!farmer) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, farmer.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: farmer._id, role: farmer.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { ...farmer._doc, password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
