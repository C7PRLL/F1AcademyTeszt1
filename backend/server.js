const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const db = require('./models');

const userRoutes = require('./routes/userRoutes');
const driverRoutes = require('./routes/driverRoutes');
const newsRoutes = require('./routes/newsRoutes');
const syncRoutes = require('./routes/syncRoutes');

const { fullF1Sync } = require('./services/f1SyncService');
const { syncF1News } = require('./services/newsSyncService');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({
    message: 'F1 Academy backend működik',
  });
});

// EZ HIÁNYZOTT
app.use('/api/users', userRoutes);

app.use('/api/drivers', driverRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/sync', syncRoutes);

function registerCronJobs() {
  cron.schedule('0 3 * * *', async () => {
    try {
      console.log('Automatikus F1 sync indult...');
      await fullF1Sync();
      console.log('Automatikus F1 sync kész.');
    } catch (error) {
      console.error('Automatikus F1 sync hiba:', error.message);
    }
  });

  cron.schedule('0 4 * * *', async () => {
    try {
      console.log('Automatikus news sync indult...');
      await syncF1News();
      console.log('Automatikus news sync kész.');
    } catch (error) {
      console.error('Automatikus news sync hiba:', error.message);
    }
  });
}

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Siker: kapcsolódva a MariaDB-hez.');
    return db.sequelize.sync();
  })
  .then(() => {
    console.log('Adatbázis szinkronizálva.');
    registerCronJobs();

    app.listen(PORT, () => {
      console.log(`A szerver fut: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Hiba:', err);
  });