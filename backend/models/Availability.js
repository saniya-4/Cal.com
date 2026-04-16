const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");   // ⚠️ use your actual export

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
  timestamps: true
});

module.exports = Availability;