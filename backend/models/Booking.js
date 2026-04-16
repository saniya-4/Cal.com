// models/Booking.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define("Booking", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  eventId: { type: DataTypes.INTEGER, allowNull: false },

  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },

  date: { type: DataTypes.DATEONLY, allowNull: false },

  startTime: { type: DataTypes.TIME, allowNull: false },
  endTime: { type: DataTypes.TIME, allowNull: false },
  status: {
  type: DataTypes.STRING,
  defaultValue: "upcoming", // upcoming | cancelled | completed
},
});

module.exports = Booking;