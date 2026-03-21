const sequelize = require('../config/database');
const Pilot = require('./Pilot');
const GrandPrix = require('./GrandPrix');
const Result = require('./Result');
const User = require('./User');
const ContactMessage = require('./ContactMessage');
const Booking = require('./Booking'); // <--- Ellenőrizd, hogy ez a sor pontosan így ott van-e!

// --- KAPCSOLATOK (Associations) ---

// Egy felhasználónak sok foglalása lehet
// Ez a 13. sor környéke, itt volt a hiba:
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Egy eredmény egy pilótához tartozik
Result.belongsTo(Pilot, { foreignKey: 'pilot_id', as: 'pilot' });
Pilot.hasMany(Result, { foreignKey: 'pilot_id' });

// Egy eredmény egy futamhoz tartozik
Result.belongsTo(GrandPrix, { foreignKey: 'race_id', as: 'race' });
GrandPrix.hasMany(Result, { foreignKey: 'race_id' });

const db = {
    sequelize,
    Pilot,
    GrandPrix,
    Result,
    User,
    ContactMessage,
    Booking
};

module.exports = db;