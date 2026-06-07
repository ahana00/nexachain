const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Referral = require('../models/Referral');

exports.direct = asyncHandler(async (req, res) => {
  const list = await User.find({ referredBy: req.user._id })
    .select('fullName email referralCode walletBalance createdAt');
  res.json(list);
});

exports.tree = asyncHandler(async (req, res) => {
  const MAX = 5;
  async function build(userId, level) {
    if (level > MAX) return [];
    const kids = await User.find({ referredBy: userId }).select('fullName email referralCode');
    return Promise.all(kids.map(async k => ({
      _id: k._id, fullName: k.fullName, email: k.email, referralCode: k.referralCode,
      level, children: await build(k._id, level + 1),
    })));
  }
  res.json(await build(req.user._id, 1));
});

exports.income = asyncHandler(async (req, res) => {
  const items = await Referral.find({ beneficiary: req.user._id })
    .populate('source', 'fullName email').sort('-date');
  res.json(items);
});
