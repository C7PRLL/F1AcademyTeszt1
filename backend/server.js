const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Adatbázis szinkronizáció
// A 'force: false' nem töröl! csak létrehozza a táblát ha még nincs 
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Siker: Kapcsolódva a MariaDB-hez és a táblák szinkronizálva.');
        app.listen(PORT, () => {
            console.log(`A szerver fut a http://localhost:${PORT} címen.`);
        });
    })
    .catch(err => {
        console.error('Hiba történt az adatbázis szinkronizációjakor:', err);
    });