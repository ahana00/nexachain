require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const routes = require('./routes');
const { startCron } = require('./jobs/roiCron');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (_, res) => res.json({ name: 'Nexachain API', status: 'ok' }));
app.use('/api', routes);

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
(async () => {
  await connectDB();
  startCron();
  app.listen(PORT, () => console.log(`🚀 API on :${PORT}`));
})();
