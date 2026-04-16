const express = require("express");
const router = express.Router();

const {
  saveAvailability,
  getAvailability,
} = require("../controllers/availabilityController");

// ✅ GLOBAL (no eventId)
router.post("/", saveAvailability);
router.get("/", getAvailability);

module.exports = router;