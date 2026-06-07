const asyncHandler = require('express-async-handler');
const Investment = require('../models/Investment');
const RoiHistory = require('../models/RoiHistory');

exports.summary = asyncHandler(async (req, res) => {
  const uid = req.user._id;
  const [agg, roi] = await Promise.all([
    Investment.aggregate([{ $match: { user: uid } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    RoiHistory.find({ user: uid }).sort('-date').limit(30),
  ]);
  res.json({
    totalInvestments: agg[0]?.total || 0,
    totalRoiEarned: req.user.totalRoiEarned,
    totalLevelIncome: req.user.totalLevelIncome,
    walletBalance: req.user.walletBalance,
    recentRoi: roi,
  });
});

exports.roiHistory = asyncHandler(async (req, res) => {
  const items = await RoiHistory.find({ user: req.user._id }).populate('investment', 'planName amount').sort('-date');
  res.json(items);
});
