const mongoose = require('mongoose');
const healthSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  animalId: { type: String, required: true },
  issue: { type: String, required: true },
  treatment: { type: String },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  notes: { type: String }
});
module.exports = mongoose.model('Health', healthSchema);
