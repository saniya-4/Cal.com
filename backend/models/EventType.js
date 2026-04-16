const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EventType = sequelize.define("EventType", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "eventtypes",   // ✅ IMPORTANT FIX
  timestamps: true
});

module.exports = EventType;