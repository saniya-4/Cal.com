const EventType = require("../models/EventType");
const Availability = require("../models/Availability");
const AvailabilitySlot = require("../models/AvailabilitySlot");
const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");

// 🔹 GET AVAILABLE SLOTS + EVENT DATA
exports.getSlots = async (req, res) => {
  try {
    const { slug } = req.params;
    const { date } = req.query;

    console.log("\n🔥 ===== GET SLOTS API =====");
    console.log("Incoming date:", date);

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // ✅ 1. Get event
    const event = await EventType.findOne({
      where: { slug },
    });

    if (!event) {
      console.log("❌ Event not found");
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.isActive) {
      console.log("❌ Event inactive");
      return res.status(400).json({ message: "Event is not active" });
    }

    console.log("✅ Event:", event.title);

    // ✅ 2. Get availability
    const availability = await Availability.findOne({
      where: { eventId: event.id },
      include: [
  {
    model: AvailabilitySlot,
    as: "AvailabilitySlots",
  },
],
    });
    console.log("📦 FULL AVAILABILITY OBJECT:");
console.log(JSON.stringify(availability, null, 2));

    if (!availability || !availability.AvailabilitySlots?.length) {
      console.log("❌ No availability found");
      return res.json({ event, slots: [] });
    }

    console.log(
      "📦 DB Days:",
      availability.AvailabilitySlots.map((s) => `"${s.day}"`)
    );
   //for now
    // // 🔥 FINAL FIX: TIMEZONE-SAFE DAY CALCULATION
    // const dayName = new Intl.DateTimeFormat("en-US", {
    //   weekday: "long",
    //   timeZone: "Asia/Kolkata",
    // }).format(new Date(date));
    const jsDay = new Date(date).getDay(); // 0–6

const dayMap = {
  0: "7",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
};

const computedDay = dayMap[jsDay];

    // console.log("📅 Computed day:", `"${dayName}"`);
    //for now
    // ✅ 3. Match correct day (safe comparison)
    // const daySlots = availability.AvailabilitySlots.filter(
    //   (slot) =>
    //     slot.day?.trim().toLowerCase() === dayName.trim().toLowerCase()
    // );
    const daySlots = availability.AvailabilitySlots.filter((slot) => {
  const cleanDay = String(slot.day).replace(/"/g, "").trim();
  return cleanDay === computedDay;
});
    console.log("🎯 Matching daySlots:", daySlots);

    let finalSlots = [];

    // ✅ 4. Generate slots
    for (let slot of daySlots) {
      let start = toMinutes(slot.startTime);
      let end = toMinutes(slot.endTime);

      console.log(`⏱ Range: ${slot.startTime} → ${slot.endTime}`);

      while (start + event.duration <= end) {
        const startTime = fromMinutes(start);
        const endTime = fromMinutes(start + event.duration);

        // 🔥 Prevent double booking
        const exists = await Booking.findOne({
          where: {
            eventId: event.id,
            date,
            startTime,
          },
        });

        if (!exists) {
          finalSlots.push({
            start: startTime,
            end: endTime,
          });
        } else {
          console.log("⚠️ Already booked:", startTime);
        }

        start += event.duration;
      }
    }

    console.log("✅ Final slots:", finalSlots);

    // ✅ 5. Response
    res.json({
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        duration: event.duration,
        slug: event.slug,
      },
      slots: finalSlots,
    });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



// 🔹 CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { eventId, name, email, date, startTime, endTime } = req.body;

    console.log("\n📩 Booking request:", req.body);

    if (!eventId || !name || !email || !date || !startTime) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 🔥 prevent double booking
    const exists = await Booking.findOne({
      where: { eventId, date, startTime },
    });

    if (exists) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // ✅ save booking
    const booking = await Booking.create({
      eventId,
      name,
      email,
      date,
      startTime,
      endTime,
    });

    // ✅ get event
    const event = await EventType.findByPk(eventId);

    // 👤 host
    // const hostName = "Saniya Garg";
    // const hostEmail = "gargsaniya192@gmail.com";

    // // 🔗 meeting link
    // const meetingLink = `http://localhost:3000/meeting/${booking.id}`;

    // // ✉️ email
    // const emailHTML = `
    //   <h2>New Meeting Scheduled</h2>

    //   <p><b>What:</b> ${event.title} between ${hostName} and ${name}</p>

    //   <p><b>When:</b> ${date} | ${startTime} - ${endTime}</p>

    //   <p><b>Who:</b></p>
    //   <ul>
    //     <li>${hostName} (Host) - ${hostEmail}</li>
    //     <li>${name} - ${email}</li>
    //   </ul>

    //   <p><b>Where:</b> Cal Video</p>

    //   <p><b>Meeting Link:</b> ${meetingLink}</p>
    // `;

    


    
    res.json({
      message: "Booking confirmed & email sent",
      booking,
    });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      order: [["date", "ASC"]],
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔧 HELPERS

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(mins) {
  const h = String(Math.floor(mins / 60)).padStart(2, "0");
  const m = String(mins % 60).padStart(2, "0");
  return `${h}:${m}`;
}