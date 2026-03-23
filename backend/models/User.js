const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    // Profil mezők
    bio: { type: DataTypes.TEXT },
    favorite_team: { type: DataTypes.STRING },
    favorite_pilot: { type: DataTypes.STRING },
    profile_image: { type: DataTypes.STRING }
}, { tableName: 'users' });

module.exports = User;