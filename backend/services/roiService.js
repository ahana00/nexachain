const Investment = require('../models/Investment');
const RoiHistory = require('../models/RoiHistory');
const User = require('../models/User');
const { distributeLevelIncome } = require('./referralService');

const dateKey = (d = new Date()) => d.toISOString().slice(0, 10); // YYYY-MM-DD

/**
 * Process daily ROI for all active investments.
 * Idempotent: unique index (investment, dateKey) guarantees single credit per day.
 */
async function runDailyRoi() {
  const today = dateKey();
  const now = new Date();
  const actives = await Investment.find({ status: 'Active', endDate: { $gte: now } });
  let processed = 0, skipped = 0;

  for (const inv of actives) {
    const amount = +(inv.amount * inv.dailyRoiPercent / 100).toFixed(4);
    try {
      await RoiHistory.create({
        user: inv.user, investment: inv._id, amount, dateKey: today, status: 'Credited',
      });
      await User.updateOne({ _id: inv.user },
        { $inc: { walletBalance: amount, totalRoiEarned: amount } });
      await distributeLevelIncome(inv.user, amount);
      processed++;
    } catch (e) {
      if (e.code === 11000) { skipped++; continue; } // already credited today
      console.error('ROI error', inv._id, e.message);
    }
  }
  // Mark completed
  await Investment.updateMany({ status: 'Active', endDate: { $lt: now } }, { status: 'Completed' });
  console.log(`[ROI] processed=${processed} skipped=${skipped} date=${today}`);
  return { processed, skipped, date: today };
}
module.exports = { runDailyRoi };
