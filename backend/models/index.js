const sequelize = require('../config/database');
const Pilot = require('./Pilot');
const GrandPrix = require('./GrandPrix');
const Result = require('./Result');
const User = require('./User');
const ContactMessage = require('./ContactMessage');

// Kapcsolatok (Associations)
Result.belongsTo(Pilot, { foreignKey: 'pilot_id', as: 'pilot' });
Pilot.hasMany(Result, { foreignKey: 'pilot_id' });

Result.belongsTo(GrandPrix, { foreignKey: 'race_id', as: 'race' });
GrandPrix.hasMany(Result, { foreignKey: 'race_id' });

const db = {
    sequelize,
    Pilot,
    GrandPrix,
    Result,
    User,
    ContactMessage
};

module.exports = db;