const Availability = require("../models/Availability");
const AvailabilitySlot = require("../models/AvailabilitySlot");

// ✅ SAVE GLOBAL AVAILABILITY
exports.saveAvailability = async (req, res) => {
  try {
    const { timezone, slots } = req.body;

    if (!slots) {
      return res.status(400).json({ message: "Missing slots" });
    }

    let availability = await Availability.findOne(); // ✅ GLOBAL

    if (!availability) {
      availability = await Availability.create({
        timezone: timezone || "Asia/Kolkata",
      });
    } else {
      availability.timezone = timezone;
      await availability.save();
    }

    // 🔥 clear old
    await AvailabilitySlot.destroy({
      where: { availabilityId: availability.id },
    });

    // 🔥 save new
    const newSlots = slots.map((slot) => ({
      availabilityId: availability.id,
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }));

    await AvailabilitySlot.bulkCreate(newSlots);

    res.json({ message: "Saved successfully" });

  } catch (error) {
    console.error("❌ SAVE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET GLOBAL AVAILABILITY
exports.getAvailability = async (req, res) => {
  try {
    let availability = await Availability.findOne({
      include: [
        {
          model: AvailabilitySlot,
          as: "AvailabilitySlots",
        },
      ],
    });

    if (!availability) {
      availability = await Availability.create({
        timezone: "Asia/Kolkata",
      });
    }

    res.json({
      timezone: availability.timezone,
      slots: availability.AvailabilitySlots || [],
    });

  } catch (error) {
    console.error("❌ GET ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};