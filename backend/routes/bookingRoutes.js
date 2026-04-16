const router = require("express").Router();
const controller = require("../controllers/bookingController");

router.get("/:slug", controller.getSlots);
router.post("/", controller.createBooking);

module.exports = router;