const Feed = require('../models/Feed');

exports.createFeed = async (req, res) => {
  try {
    const { name, type, quantity, unit, purchaseDate, cost, supplier, notes } = req.body;
    
    if (!name || !type || !quantity || !cost) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const feed = await Feed.create({
      farmerId: req.user._id,
      name,
      type,
      quantity: Number(quantity),
      unit: unit || 'kg',
      purchaseDate: new Date(purchaseDate),
      cost: Number(cost),
      supplier,
      notes
    });
    
    res.status(201).json(feed);
  } catch (err) {
    console.error('Error creating feed:', err);
    res.status(500).json({ message: 'Failed to create feed record', error: err.message });
  }
};

exports.getFeeds = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { farmerId: req.user._id };
    const feeds = await Feed.find(filter);
    res.json(feeds);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateFeed = async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id);
    if (!feed) return res.status(404).json({ message: 'Feed not found' });
    if (req.user.role !== 'admin' && !feed.farmerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    feed.feedType = req.body.feedType || feed.feedType;
    feed.quantity = req.body.quantity || feed.quantity;
    feed.cost = req.body.cost || feed.cost;
    await feed.save();
    res.json(feed);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteFeed = async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id);
    if (!feed) return res.status(404).json({ message: 'Feed not found' });
    if (req.user.role !== 'admin' && !feed.farmerId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await feed.deleteOne();
    res.json({ message: 'Feed deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
