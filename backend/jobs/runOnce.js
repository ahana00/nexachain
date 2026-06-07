// Manual trigger: `node jobs/runOnce.js`
require('dotenv').config();
const connectDB = require('../config/db');
const { runDailyRoi } = require('../services/roiService');
(async () => {
  await connectDB();
  const r = await runDailyRoi();
  console.log(r);
  process.exit(0);
})();
