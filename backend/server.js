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
app.use(cors());
app.get("/", (req, res) => {
  res.json({ message: "Backend is running with Express.js" });
});
app.use(express.json());
app.use("/api/events", eventRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/book", bookingRoutes);
app.use("/api/bookings",bookingsRoutes);
(async()=>
  {
     try{
        await sequelize.sync();
     console.log(`Databse synchronized successfully`);
     
     }catch(error)
   {         console.log(`Error synchronizing datanase:`,error);
   }

 })();
 Availability.hasMany(AvailabilitySlot, {
  foreignKey: "availabilityId",
  onDelete: "CASCADE",
});

AvailabilitySlot.belongsTo(Availability, {
  foreignKey: "availabilityId",
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
