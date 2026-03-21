const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    activity_type: { type: DataTypes.STRING, allowNull: false }, 
    booking_date: { type: DataTypes.DATEONLY, allowNull: false },
    time_slot: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'confirmed' }
}, { tableName: 'bookings' });


module.exports = Booking;