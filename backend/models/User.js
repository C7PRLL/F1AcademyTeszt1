const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    verification_token: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },

    verification_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    verified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    password_reset_token: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },

    password_reset_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    favorite_team: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    favorite_pilot: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    profile_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    google_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    facebook_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;