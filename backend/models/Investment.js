const mongoose = require('mongoose');
const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true, min: 1 },
  planName: { type: String, required: true },
  durationDays: { type: Number, required: true },
  dailyRoiPercent: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Completed', 'Cancelled'], default: 'Active', index: true },
}, { timestamps: true });
module.exports = mongoose.model('Investment', investmentSchema);
