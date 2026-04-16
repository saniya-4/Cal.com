const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Availability = sequelize.define("Availability", {
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: "Asia/Kolkata",
  },
}, {
  tableName: "availabilities",   // ✅ FIX
  timestamps: true
});

module.exports = Availability;