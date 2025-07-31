const mongoose = require('mongoose');
const breedSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  breedName: { type: String, required: true },
  origin: { type: String },
  description: { type: String },
  characteristics: { type: String },
  avgMilkProduction: { type: Number },
  avgWeight: { type: Number },
  dateAdded: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Breed', breedSchema);
