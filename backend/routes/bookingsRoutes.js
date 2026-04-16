const router = require("express").Router();
const controller = require("../controllers/bookingController");

router.get("/", controller.getBookings);
router.put("/cancel/:id", controller.cancelBooking);

module.exports = router;