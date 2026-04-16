import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { getAvailability } from "../api/api";

function BookingPage() {
  const { slug } = useParams();
  const fullFormPanel = {
    flex: 1,
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const input = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#111",
    color: "white",
  };

  const textarea = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#111",
    color: "white",
    minHeight: "100px",
  };

  const backBtn = {
    padding: "10px",
    background: "#222",
    color: "white",
  };

  const confirmBtn = {
    padding: "10px",
    background: "white",
    color: "black",
  };

  const [availability, setAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [event, setEvent] = useState(null);
  // 🔥 MONTH NAVIGATION FUNCTION
  const changeMonth = (dir) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + dir);

    setCurrentMonth(newMonth);

    // optional (recommended)
    const firstDay = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
    setSelectedDate(firstDay);
  };
  // 🔥 FETCH EVENT (for title + duration)
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/events/slug/${slug}`,
        );
        setEvent(res.data);
      } catch (err) {
        console.error("Event fetch error:", err);
      }
    };

    fetchEvent();
  }, [slug]);

  // 🔥 FETCH GLOBAL AVAILABILITY
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await getAvailability();
        console.log("AVAILABILITY:", res.data.slots);
        setAvailability(res.data.slots || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAvailability();
  }, []);

  // 🔥 DAY LOGIC
  const getDayNumber = (date) => {
    return new Date(date).getDay().toString(); // 0–6
  };

  const getSlotsForDay = (date) => {
    const day = getDayNumber(date);
    return availability.filter((slot) => slot.day === day);
  };

  // 🔥 GENERATE SLOTS FROM DB
  const generateTimeSlots = (date) => {
    const daySlots = getSlotsForDay(date);

    let allSlots = [];

    daySlots.forEach((slot) => {
      let current = slot.startTime;

      while (current < slot.endTime) {
        allSlots.push({
          start: current,
          end: slot.endTime,
        });

        let [h, m] = current.split(":").map(Number);
        m += 15;

        if (m >= 60) {
          h += 1;
          m -= 60;
        }

        current = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
      }
    });

    return allSlots;
  };

  const generatedSlots = generateTimeSlots(selectedDate);

  const handleBooking = async () => {
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];

      await axios.post("http://localhost:5000/api/book", {
        eventId: event.id,
        name,
        email,
        date: dateStr,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
      });
      alert("✅ Booking successful! Email sent");

      setBookingSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Error booking");
    }
  };

  // 🔥 CALENDAR
  const getDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    let days = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));

    return days;
  };

  const days = getDays();
  if (bookingSuccess) {
    return (
      <div style={container}>
        <div
          style={{
            width: "500px",
            padding: "40px",
            background: "#111",
            borderRadius: "16px",
            border: "1px solid #222",
            textAlign: "center",
          }}
        >
          <h2>✅ This meeting is scheduled</h2>

          <p style={{ color: "#9ca3af" }}>We sent an email with the details.</p>

          <hr style={{ margin: "20px 0", borderColor: "#333" }} />

          <p>
            <b>Event:</b> {event?.title}
          </p>

          <p>
            <b>Date:</b> {selectedDate.toDateString()}
          </p>

          <p>
            <b>Time:</b> {formatTime(selectedSlot.start)} -{" "}
            {formatTime(selectedSlot.end)}
          </p>

          <p>
            <b>User:</b> {name} ({email})
          </p>
        </div>
      </div>
    );
  }
  return (
    <div style={container}>
      <div style={card}>
        {/* LEFT PANEL */}
        <div style={leftPanel}>
          <div style={avatar}>S</div>

          <p style={{ color: "#9ca3af" }}>Saniya Garg</p>

          <h2>{event?.title}</h2>
          <p style={{ color: "#9ca3af" }}>{event?.description}</p>

          {showForm && selectedSlot && (
            <>
              <p>📅 {selectedDate.toDateString()}</p>
              <p>
                {formatTime(selectedSlot.start)} -{" "}
                {formatTime(selectedSlot.end)}
              </p>
            </>
          )}
        </div>

        {/* RIGHT SIDE SWITCH */}
        {!showForm ? (
          <>
            <div style={calendarPanel}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <h3>
                  {currentMonth.toLocaleString("default", { month: "long" })}{" "}
                  {currentMonth.getFullYear()}
                </h3>

                <div>
                  <button
                    style={{
                      marginRight: "8px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#f3f4f6",
                      cursor: "pointer",
                      fontSize: "18px",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => changeMonth(-1)}
                    
                  >
                    ‹
                  </button>

                  <button
                    style={{
                      marginRight: "8px",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#f3f4f6",
                      cursor: "pointer",
                      fontSize: "18px",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => changeMonth(1)}
                  >
                    ›
                  </button>
                </div>
              </div>
              <div style={grid}>
                {days.map((d, i) => {
                  const isSelected =
                    d && d.toDateString() === selectedDate.toDateString();

                  return (
                    <div
                      key={i}
                      onClick={() => {
                        if (!d) return;
                        setSelectedDate(d);
                      }}
                      style={{
                        ...dayBox,
                        background: isSelected ? "#fff" : "#222",
                        color: isSelected ? "#000" : "#fff",
                      }}
                    >
                      {d && d.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SLOTS */}
            <div style={slotsPanel}>
              <h4>{selectedDate.toDateString()}</h4>

              <div style={scrollContainer}>
                {generatedSlots.map((s, i) => (
                  <div
                    key={i}
                    style={slotBox}
                    onClick={() => {
                      setSelectedSlot(s);
                      setShowForm(true); // 🔥 IMPORTANT
                    }}
                  >
                    {formatTime(s.start)}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={fullFormPanel}>
            <h3>Your name *</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={input}
            />

            <h3>Email address *</h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={input}
            />

            <h3>Additional notes</h3>
            <textarea style={textarea} />

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button onClick={() => setShowForm(false)} style={backBtn}>
                Back
              </button>

              <button onClick={handleBooking} style={confirmBtn}>
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 🎨 STYLES (same as yours)
const container = {
  background: "#0b0b0c",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
};
const card = {
  display: "flex",
  width: "1000px",
  border: "1px solid #222",
  borderRadius: "16px",
};
const leftPanel = { width: "250px", padding: "20px" };
const avatar = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  background: "orange",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const calendarPanel = { flex: 1, padding: "20px" };
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(7,1fr)",
  gap: "10px",
};
const dayBox = {
  height: "60px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "10px",
};
const slotsPanel = { width: "250px", padding: "20px" };
const scrollContainer = { maxHeight: "400px", overflowY: "auto" };
const slotBox = {
  padding: "10px",
  border: "1px solid #333",
  borderRadius: "10px",
  marginBottom: "10px",
  textAlign: "center",
  cursor: "pointer",
};

function formatTime(time) {
  const [h, m] = time.split(":");
  let hour = parseInt(h);
  const suffix = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12;
  return `${hour}:${m}${suffix}`;
}

export default BookingPage;
