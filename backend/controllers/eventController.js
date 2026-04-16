const EventType = require("../models/EventType");
const Availability = require("../models/Availability");
const AvailabilitySlot = require("../models/AvailabilitySlot");
const slugify = require("slugify");


// ✅ CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    if (!title || !duration) {
      return res.status(400).json({ message: "Missing fields" });
    }

    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    // ensure unique slug
    while (await EventType.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const event = await EventType.create({
      title,
      description,
      duration,
      slug,
    });
    const availability = await Availability.create({
  eventId: event.id,
  timezone: "Asia/Kolkata",
});

// ✅ CREATE DEFAULT SLOTS (Mon–Fri)
const slots = [];

for (let i = 1; i <= 5; i++) {
  slots.push({
    availabilityId: availability.id,
    day: i,
    startTime: "09:00",
    endTime: "17:00",
  });
}

await AvailabilitySlot.bulkCreate(slots);

    res.status(201).json(event);
  } 
    catch (err) {
  console.error("CREATE EVENT ERROR:", err);  // 👈 ADD THIS
  res.status(500).json({ error: err.message });

    
  }
};


// ✅ GET ALL EVENTS
exports.getEvents = async (req, res) => {
  try {
    const events = await EventType.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(events);
  } catch (err) {
    console.error("GET EVENTS ERROR:", err); 
    res.status(500).json({ error: err.message });
  }
};


// ✅ GET SINGLE EVENT (for edit page)
exports.getEventById = async (req, res) => {
  try {
    const event = await EventType.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const { title, description, duration } = req.body;

    const event = await EventType.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ UPDATE TITLE + SLUG (only if changed)
    if (title !== undefined && title !== event.title) {
      let baseSlug = slugify(title, { lower: true, strict: true });
      let slug = baseSlug;
      let count = 1;

      // 🔥 IMPORTANT: exclude current event
      while (
        await EventType.findOne({
          where: {
            slug,
            id: { [require("sequelize").Op.ne]: event.id },
          },
        })
      ) {
        slug = `${baseSlug}-${count}`;
        count++;
      }

      event.title = title;
      event.slug = slug;
    }

    // ✅ ALLOW EMPTY STRING (important for description)
    if (description !== undefined) {
      event.description = description;
    }

    // ✅ SAFE NUMBER UPDATE
    if (duration !== undefined) {
      event.duration = duration;
    }

    await event.save();

    res.json({
      message: "Event updated successfully",
      event,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    const event = await EventType.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.destroy();

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ TOGGLE ACTIVE (for UI switch)
exports.toggleEvent = async (req, res) => {
  try {
    const event = await EventType.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.isActive = !event.isActive;
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};