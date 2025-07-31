const mongoose = require('mongoose');
const feedSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['roughage', 'concentrate', 'supplement', 'mineral'] },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true, default: 'kg' },
  purchaseDate: { type: Date, required: true },
  cost: { type: Number, required: true },
  supplier: { type: String },
  notes: { type: String },
  dateAdded: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Feed', feedSchema);
