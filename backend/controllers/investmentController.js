const asyncHandler = require('express-async-handler');
const Investment = require('../models/Investment');

exports.create = asyncHandler(async (req, res) => {
  const { amount, planName, durationDays, dailyRoiPercent } = req.body;
  if (!amount || !planName || !durationDays || !dailyRoiPercent)
    return res.status(400).json({ message: 'Missing fields' });
  const endDate = new Date(Date.now() + durationDays * 86400000);
  const inv = await Investment.create({
    user: req.user._id, amount, planName, durationDays, dailyRoiPercent, endDate,
  });
  res.status(201).json(inv);
});

exports.list = asyncHandler(async (req, res) => {
  const items = await Investment.find({ user: req.user._id }).sort('-createdAt');
  res.json(items);
});
