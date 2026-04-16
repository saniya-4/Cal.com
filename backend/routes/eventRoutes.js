// const express = require("express");
// const router = express.Router();
// const EventType = require("../models/EventType");
// const {
//   createEvent,
//   getEvents,
//   getEventById,
//   updateEvent,
//   deleteEvent,
//   toggleEvent,
// } = require("../controllers/eventController");

// // CREATE
// router.post("/", createEvent);

// // READ
// router.get("/", getEvents);
// router.get("/:id", getEventById);

// // UPDATE
// router.put("/:id", updateEvent);

// // DELETE
// router.delete("/:id", deleteEvent);

// // TOGGLE ACTIVE
// router.patch("/:id/toggle", toggleEvent);
// router.get("/:slug", async (req, res) => {
//   try {
//     const { slug } = req.params;

//     const event = await EventType.findOne({
//       where: { slug },
//     });

//     if (!event) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     res.json(event); // 🔥 returns id also

//   } catch (error) {
//     console.error("❌ EVENT FETCH ERROR:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const EventType = require("../models/EventType");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleEvent,
} = require("../controllers/eventController");

// CREATE
router.post("/", createEvent);

// READ ALL
router.get("/", getEvents);

router.get("/slug/:slug", async (req, res) => {
  try {
    const slug = req.params.slug.trim(); // 🔥 FIX

    const event = await EventType.findOne({
      where: { slug },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);

  } catch (error) {
    console.error("❌ EVENT FETCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// GET BY ID
router.get("/:id", getEventById);

// UPDATE
router.put("/:id", updateEvent);

// DELETE
router.delete("/:id", deleteEvent);

// TOGGLE ACTIVE
router.patch("/:id/toggle", toggleEvent);

module.exports = router;