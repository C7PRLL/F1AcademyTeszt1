const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const db = require('./models');

const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const driverRoutes = require('./routes/driverRoutes');
const newsRoutes = require('./routes/newsRoutes');
const authRoutes = require('./routes/authRoutes');
const syncRoutes = require('./routes/SyncRoutes');

// CRON JOB BETÖLTÉSE
require('./jobs/verificationCleanupJob');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // localhoston false
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sync', syncRoutes);

// kompatibilitás
app.use('/api/pilots', driverRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.json({ message: 'Backend működik' });
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Siker: kapcsolódva a MariaDB-hez.');
    return db.sequelize.sync();
  })
  .then(() => {
    console.log('Adatbázis szinkronizálva.');
    app.listen(PORT, () => {
      console.log(`A szerver fut: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Hiba:', err);
  });