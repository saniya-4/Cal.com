
const Booking = require("../models/Booking");

exports.generateSlots = async (event, slots, date) => {
  const day = new Date(date).toLocaleString("en-US", { weekday: "long" });

  const daySlots = slots.filter((s) => s.day === day);

  let result = [];

  for (let slot of daySlots) {
    let start = parseTime(slot.startTime);
    let end = parseTime(slot.endTime);

    while (start + event.duration <= end) {
      const slotStart = formatTime(start);
      const slotEnd = formatTime(start + event.duration);

      // 🚨 prevent double booking
      const exists = await Booking.findOne({
        where: {
          eventId: event.id,
          date,
          startTime: slotStart,
        },
      });

      if (!exists) {
        result.push({
          start: slotStart,
          end: slotEnd,
        });
      }

      start += event.duration;
    }
  }

  return result;
};

// helpers
function parseTime(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}