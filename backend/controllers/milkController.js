const MilkProduction = require('../models/MilkProduction');

exports.createMilk = async (req, res) => {
  try {
    const { quantity, date, notes } = req.body;
    const milk = await MilkProduction.create({
      farmerId: req.user._id,
      quantity,
      date,
      notes
    });
    res.status(201).json(milk);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMilkRecords = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { farmerId: req.user._id };
    const milkRecords = await MilkProduction.find(filter);
    res.json(milkRecords);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateMilk = async (req, res) => {
  try {
    const milk = await MilkProduction.findById(req.params.id);
    if (!milk) return res.status(404).json({ message: 'Milk record not found' });
    if (req.user.role !== 'admin' && !milk.farmerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    milk.quantity = req.body.quantity || milk.quantity;
    milk.date = req.body.date || milk.date;
    milk.notes = req.body.notes || milk.notes;
    await milk.save();
    res.json(milk);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteMilk = async (req, res) => {
  try {
    const milk = await MilkProduction.findById(req.params.id);
    if (!milk) return res.status(404).json({ message: 'Milk record not found' });
    if (req.user.role !== 'admin' && !milk.farmerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await milk.deleteOne();
    res.json({ message: 'Milk record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
