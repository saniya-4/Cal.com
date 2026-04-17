const express = require("express");
const app=express();
const cors = require("cors");
require("./models/associations");
const sequelize  = require("./config/db.js");
const eventRoutes=require("./routes/eventRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const bookingsRoutes=require("./routes/bookingsRoutes.js")
const Availability = require("./models/Availability");
const AvailabilitySlot = require("./models/AvailabilitySlot");
const PORT = process.env.PORT || 5000;
const bookingRoutes = require("./routes/bookingRoutes");
// app.use(cors());

//new change 
app.use(cors({
  origin: "https://cal-1gfdc9ecf-saniyas-projects-ddb842a7.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Backend is running with Express.js" });
});

app.use("/api/events", eventRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/book", bookingRoutes);
app.use("/api/bookings",bookingsRoutes);
console.log("DB URL:", process.env.DATABASE_URL);

(async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connected successfully ✅`);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.log(`Error connecting database:`, error);
  }
})();
 Availability.hasMany(AvailabilitySlot, {
  foreignKey: "availabilityId",
  onDelete: "CASCADE",
});

AvailabilitySlot.belongsTo(Availability, {
  foreignKey: "availabilityId",
});

