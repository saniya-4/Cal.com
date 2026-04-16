import { deleteEvent, toggleEvent } from "../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EventCard({ event, refresh }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const bookingUrl = `${window.location.origin}/book/${event.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      alert("Link copied!");
    } catch {
      alert("Copy failed");
    }
  };

  const handleOpen = () => {
    window.open(`/book/${event.slug}`, "_blank");
  };

  const handleDelete = async () => {
    await deleteEvent(event.id);
    refresh();
    setShowMenu(false);
  };

  const handleEdit = () => {
    navigate(`/event/edit/${event.id}`);
  };

  // const handleToggle = async () => {
  //   await toggleEvent(event.id);
  //   refresh();
  // };

  return (
    <div
      style={{
        background: "#0f0f11",
        border: "1px solid #1f1f1f",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* LEFT */}
      <div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>{event.title}</h3>

          <span style={{ color: "#777", fontSize: "14px" }}>
            /saniya-garg-cyn064/{event.slug}
          </span>
        </div>

        <p style={{ color: "#aaa", margin: "6px 0" }}>{event.description}</p>

        <span
          style={{
            background: "#1a1a1a",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
          }}
        >
          ⏱ {event.duration}m
        </span>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            border: "1px solid #333",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <button onClick={handleOpen} style={iconBtn}>
            ↗
          </button>
          <button onClick={handleCopy} style={iconBtn}>
            🔗
          </button>

          {/* MORE BUTTON */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{ ...iconBtn, borderRight: "none" }}
          >
            ⋯
          </button>
        </div>
      </div>

      {/* 🔥 DROPDOWN MENU */}
      {showMenu && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            right: "20px",
            background: "#111",
            border: "1px solid #333",
            borderRadius: "10px",
            width: "180px",
            overflow: "hidden",
            zIndex: 10,
          }}
        >
          <div style={menuItem} onClick={handleEdit}>
            ✏️ Edit
          </div>

          <div style={menuItem} onClick={handleDelete}>
            🗑 Delete
          </div>
        </div>
      )}
    </div>
  );
}

const iconBtn = {
  background: "#0f0f11",
  border: "none",
  borderRight: "1px solid #333",
  color: "white",
  padding: "8px 10px",
  cursor: "pointer",
};

const menuItem = {
  padding: "10px",
  cursor: "pointer",
  borderBottom: "1px solid #222",
};

export default EventCard;
