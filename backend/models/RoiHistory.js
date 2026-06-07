const mongoose = require('mongoose');
const roiSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  investment: { type: mongoose.Schema.Types.ObjectId, ref: 'Investment', required: true, index: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  dateKey: { type: String, required: true }, // YYYY-MM-DD for idempotency
  status: { type: String, enum: ['Credited', 'Pending', 'Failed'], default: 'Credited' },
}, { timestamps: true });

// CRITICAL: prevents double-crediting if cron runs twice
roiSchema.index({ investment: 1, dateKey: 1 }, { unique: true });
module.exports = mongoose.model('RoiHistory', roiSchema);
