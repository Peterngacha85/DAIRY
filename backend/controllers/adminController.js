const Farmer = require('../models/Farmer');
const MilkProduction = require('../models/MilkProduction');
const Breed = require('../models/Breed');
const Feed = require('../models/Feed');
const Health = require('../models/Health');

// Dashboard overview
exports.getDashboard = async (req, res) => {
  try {
    const totalFarmers = await Farmer.countDocuments();
    const totalMilk = await MilkProduction.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);
    const totalBreeds = await Breed.countDocuments();
    const totalFeeds = await Feed.countDocuments();
    const totalHealth = await Health.countDocuments();
    res.json({
      totalFarmers,
      totalMilk: totalMilk[0] ? totalMilk[0].total : 0,
      totalBreeds,
      totalFeeds,
      totalHealth
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// List all farmers
exports.getFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().select('-password');
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Block/unblock farmer
exports.toggleBlock = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    farmer.isBlocked = !farmer.isBlocked;
    await farmer.save();
    res.json({ message: `Farmer ${farmer.isBlocked ? 'blocked' : 'unblocked'}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete farmer
exports.deleteFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json({ message: 'Farmer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
