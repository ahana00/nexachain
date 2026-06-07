const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  referralCode: { type: String, unique: true, index: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  walletBalance: { type: Number, default: 0 },
  totalRoiEarned: { type: Number, default: 0 },
  totalLevelIncome: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);
