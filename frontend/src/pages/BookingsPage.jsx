import { useEffect, useState } from "react";
import axios from "axios";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/bookings`
);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const now = new Date();

  const upcoming = bookings.filter((b) => {
    const t = new Date(`${b.date}T${b.startTime}`);
    return t >= now && b.status !== "cancelled";
  });

  const past = bookings.filter((b) => {
    const t = new Date(`${b.date}T${b.endTime}`);
    return t < now && b.status !== "cancelled";
  });

  const cancelled = bookings.filter((b) => b.status === "cancelled");

  const getFiltered = () => {
    if (activeTab === "Upcoming") return upcoming;
    if (activeTab === "Past") return past;
    if (activeTab === "Canceled") return cancelled;
    return bookings;
  };

  const cancelBooking = async (id) => {
    try {
      await axios.put(
  `${import.meta.env.VITE_API_URL}/api/bookings/cancel/${id}`
);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = getFiltered();

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      
      {/* HEADER */}
      <h1 style={{ fontSize: "28px", fontWeight: "600" }}>Bookings</h1>
      <p style={{ color: "#9ca3af" }}>
        See upcoming and past events booked through your event type links.
      </p>

      {/* TABS */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {["Upcoming", "Past", "Canceled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              border: "1px solid #2d3748",
              background: activeTab === tab ? "#1f2937" : "transparent",
              color: "white",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div style={{ marginTop: "20px" }}>
        {filtered.length === 0 && (
          <p style={{ color: "#9ca3af" }}>No bookings found</p>
        )}

        {filtered.map((b) => (
          <div
            key={b.id}
            style={{
              background: "#020617", // ✅ FIXED (no blue)
              border: "1px solid #1e293b",
              borderRadius: "10px",
              padding: "18px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* LEFT */}
            <div>
              <div style={{ fontWeight: "600" }}>
                {new Date(b.date).toDateString()}
              </div>

              <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                {b.startTime} - {b.endTime}
              </div>

              <div style={{ marginTop: "6px", fontWeight: "500" }}>
                Meeting between Saniya Garg and {b.name}
              </div>

              <div style={{ color: "#9ca3af", fontSize: "14px" }}>
                You and {b.name}
              </div>

              <div style={{ color: "#3b82f6", marginTop: "6px" }}>
                🎥 Join Cal Video
              </div>
            </div>

            {/* RIGHT MENU */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() =>
                  setOpenMenu(openMenu === b.id ? null : b.id)
                }
                style={{
                  border: "1px solid #2d3748",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  background: "transparent",
                  color: "white",
                }}
              >
                ⋯
              </button>

              {/* DROPDOWN */}
              {openMenu === b.id && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                    padding: "8px",
                    minWidth: "120px",
                    zIndex: 10,
                  }}
                >
                  {b.status !== "cancelled" && (
                    <div
                      onClick={() => {
                        cancelBooking(b.id);
                        setOpenMenu(null);
                      }}
                      style={{
                        padding: "6px",
                        color: "red",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          borderTop: "1px solid #1e293b",
          paddingTop: "10px",
        }}
      >
        <div>
          <select style={{ background: "#0b0b0c", color: "white" }}>
            <option>10</option>
          </select>
          <span style={{ marginLeft: "8px" }}>rows per page</span>
        </div>

        <div style={{ color: "#9ca3af" }}>
          1-{filtered.length} of {filtered.length}
        </div>
      </div>
    </div>
  );
}

export default BookingsPage;