const mongoose = require('mongoose');
const referralSchema = new mongoose.Schema({
  beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  source: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  level: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now, index: true },
}, { timestamps: true });
module.exports = mongoose.model('Referral', referralSchema);
