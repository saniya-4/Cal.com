const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AvailabilitySlot = sequelize.define("AvailabilitySlot", {
  availabilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  day: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "availabilityslots",   // ✅ IMPORTANT FIX
  timestamps: true
});

module.exports = AvailabilitySlot;