const mongoose = require('mongoose');
const milkProductionSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  quantity: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String }
});
module.exports = mongoose.model('MilkProduction', milkProductionSchema);
