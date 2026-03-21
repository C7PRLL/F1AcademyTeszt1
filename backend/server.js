const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


const pilotRoutes = require('./routes/pilotRoutes');
app.use('/api/pilots', pilotRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);

app.use('/uploads', express.static('uploads')); 

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: true }) 
    .then(() => {
        console.log('Siker: Kapcsolódva a MariaDB-hez (Adatbázis szinkronizálva).');
        app.listen(PORT, () => {
            console.log(`A szerver fut a http://localhost:${PORT} címen.`);
        });
    })
    .catch(err => {
        console.error('Hiba:', err);
    });