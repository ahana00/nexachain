const User = require('../models/User');
const Referral = require('../models/Referral');

/**
 * Distribute level income up the referral chain when `sourceUser` earns `baseAmount`.
 * Percentages per level come from env LEVEL_PERCENTAGES (default 10,5,3,2,1).
 */
async function distributeLevelIncome(sourceUserId, baseAmount) {
  const pct = (process.env.LEVEL_PERCENTAGES || '10,5,3,2,1').split(',').map(Number);
  let current = await User.findById(sourceUserId).select('referredBy');
  for (let level = 1; level <= pct.length; level++) {
    if (!current?.referredBy) break;
    const parent = await User.findById(current.referredBy).select('_id referredBy status');
    if (!parent || parent.status !== 'Active') break;
    const amount = +(baseAmount * pct[level - 1] / 100).toFixed(4);
    if (amount > 0) {
      await Referral.create({ beneficiary: parent._id, source: sourceUserId, level, amount });
      await User.updateOne({ _id: parent._id },
        { $inc: { walletBalance: amount, totalLevelIncome: amount } });
    }
    current = parent;
  }
}
module.exports = { distributeLevelIncome };
