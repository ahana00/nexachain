const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const gen = require('../utils/generateReferralCode');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });

exports.register = asyncHandler(async (req, res) => {
  const { fullName, email, mobile, password, referralCode } = req.body;
  if (!fullName || !email || !mobile || !password)
    return res.status(400).json({ message: 'Missing fields' });

  if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already in use' });

  let referredBy = null;
  if (referralCode) {
    const parent = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (!parent) return res.status(400).json({ message: 'Invalid referral code' });
    referredBy = parent._id;
  }

  const hash = await bcrypt.hash(password, 10);
  let code, exists = true;
  while (exists) { code = gen(fullName); exists = await User.exists({ referralCode: code }); }

  const user = await User.create({ fullName, email, mobile, password: hash, referralCode: code, referredBy });
  res.status(201).json({ token: sign(user._id), user: sanitize(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  res.json({ token: sign(user._id), user: sanitize(user) });
});

exports.me = asyncHandler(async (req, res) => res.json(req.user));

function sanitize(u) {
  return { _id: u._id, fullName: u.fullName, email: u.email, mobile: u.mobile,
    referralCode: u.referralCode, referredBy: u.referredBy, walletBalance: u.walletBalance,
    totalRoiEarned: u.totalRoiEarned, totalLevelIncome: u.totalLevelIncome, status: u.status };
}
