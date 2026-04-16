const Availability = require("./Availability");
const AvailabilitySlot = require("./AvailabilitySlot");

Availability.hasMany(AvailabilitySlot, {
  foreignKey: "availabilityId",
  as: "AvailabilitySlots",
  onDelete: "CASCADE",
});

AvailabilitySlot.belongsTo(Availability, {
  foreignKey: "availabilityId",
});