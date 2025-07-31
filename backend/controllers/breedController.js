const Breed = require('../models/Breed');

exports.createBreed = async (req, res) => {
  try {
    const { name, description, origin, characteristics, avgMilkProduction, avgWeight } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Breed name is required' });
    }

    const breedExists = await Breed.findOne({ 
      farmerId: req.user._id, 
      breedName: name 
    });

    if (breedExists) {
      return res.status(400).json({ message: 'This breed already exists for your farm' });
    }

    const breed = await Breed.create({
      farmerId: req.user._id,
      breedName: name,
      description,
      origin,
      characteristics,
      avgMilkProduction: avgMilkProduction || 0,
      avgWeight: avgWeight || 0
    });

    res.status(201).json({
      success: true,
      data: breed
    });
  } catch (err) {
    console.error('Error creating breed:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create breed', 
      error: err.message 
    });
  }
};

exports.getBreeds = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { farmerId: req.user._id };
    const breeds = await Breed.find(filter);
    res.json(breeds);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateBreed = async (req, res) => {
  try {
    const breed = await Breed.findById(req.params.id);
    if (!breed) return res.status(404).json({ message: 'Breed not found' });
    if (req.user.role !== 'admin' && !breed.farmerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    breed.breedName = req.body.breedName || breed.breedName;
    breed.description = req.body.description || breed.description;
    await breed.save();
    res.json(breed);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteBreed = async (req, res) => {
  try {
    const breed = await Breed.findById(req.params.id);
    if (!breed) return res.status(404).json({ message: 'Breed not found' });
    if (req.user.role !== 'admin' && !breed.farmerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await breed.deleteOne();
    res.json({ message: 'Breed deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
