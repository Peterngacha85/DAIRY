const Health = require('../models/Health');

exports.createHealth = async (req, res) => {
  try {
    const { animalId, issue, treatment, date, status, notes } = req.body;
    const health = await Health.create({
      farmerId: req.user._id,
      animalId,
      issue,
      treatment,
      date: new Date(date),
      status,
      notes
    });
    res.status(201).json(health);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getHealthRecords = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { farmerId: req.user._id };
    const healthRecords = await Health.find(filter);
    res.json(healthRecords);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateHealth = async (req, res) => {
  try {
    const health = await Health.findById(req.params.id);
    if (!health) return res.status(404).json({ message: 'Health record not found' });
    if (req.user.role !== 'admin' && !health.farmerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    health.animalId = req.body.animalId || health.animalId;
    health.disease = req.body.disease || health.disease;
    health.treatment = req.body.treatment || health.treatment;
    health.vetName = req.body.vetName || health.vetName;
    await health.save();
    res.json(health);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteHealth = async (req, res) => {
  try {
    const health = await Health.findById(req.params.id);
    if (!health) return res.status(404).json({ message: 'Health record not found' });
    if (req.user.role !== 'admin' && !health.farmerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await health.deleteOne();
    res.json({ message: 'Health record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
