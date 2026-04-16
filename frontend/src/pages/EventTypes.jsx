import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import CreateEventModal from "../components/CreateEventModal";
import { getEvents } from "../api/api";
import EmptyState from "../components/EmptyState";

function EventTypes() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchEvents = async () => {
    const res = await getEvents();
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      {/* 🔥 MAIN PAGE */}
      <div style={{ padding: "24px 32px", color: "white" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ margin: 0 }}>Event types</h1>
            <p style={{ color: "#888", fontSize: "14px" }}>
              Configure different events for people to book on your calendar.
            </p>
          </div>

          <div>
            <input
              placeholder="Search"
              style={{
                background: "#111",
                border: "1px solid #222",
                padding: "8px 12px",
                borderRadius: "8px",
                color: "white",
                marginRight: "10px",
              }}
            />

            <button
              onClick={() => setOpen(true)}
              style={{
                background: "white",
                borderRadius: "8px",
                padding: "8px 14px",
                border: "none",
                cursor: "pointer",
              }}
            >
              + New
            </button>
          </div>
        </div>

        {/* EVENTS */}
        <div style={{ marginTop: "30px" }}>
          {events.length === 0 ? (
            <EmptyState openModal={() => setOpen(true)} />
          ) : (
            events.map((event) => (
              <EventCard key={event.id} event={event} refresh={fetchEvents} />
            ))
          )}
        </div>
      </div>

      {/* 🔥 MODAL OUTSIDE (VERY IMPORTANT FIX) */}
      {open && (
        <CreateEventModal
          close={() => setOpen(false)}
          refresh={fetchEvents}
        />
      )}
    </>
  );
}

export default EventTypes;