const cron = require('node-cron');
const { runDailyRoi } = require('../services/roiService');

// Every day at 00:00 server time
function startCron() {
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Daily ROI cron starting…');
    try { await runDailyRoi(); } catch (e) { console.error('Cron failed', e); }
  });
  console.log('🗓  ROI cron scheduled: 0 0 * * *');
}
module.exports = { startCron };
