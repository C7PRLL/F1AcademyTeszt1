const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// --- ÚJ RÉSZ: Útvonalak beimportálása ---
const pilotRoutes = require('./routes/pilotRoutes');
app.use('/api/pilots', pilotRoutes);
// ---------------------------------------

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Siker: Kapcsolódva a MariaDB-hez.');
        app.listen(PORT, () => {
            console.log(`A szerver fut a http://localhost:${PORT} címen.`);
        });
    })
    .catch(err => {
        console.error('Hiba:', err);
    });