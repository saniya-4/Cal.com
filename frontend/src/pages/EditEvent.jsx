import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, updateEvent } from "../api/api";

// ── tiny icon helpers (inline SVGs, no extra deps) ──────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  back:       "M19 12H5M12 5l-7 7 7 7",
  basics:     "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  avail:      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  limits:     "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  advanced:   "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
  recurring:  "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  apps:       "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
  workflows:  "M13 10V3L4 14h7v7l9-11h-7z",
  webhooks:   "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  external:   "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14",
  link:       "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  code:       "M10 20l4-16M6 16l-4-4 4-4m8 0l4 4-4 4",
  trash:      "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  chevRight:  "M9 5l7 7-7 7",
  bold:       "M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z",
  italic:     "M19 4h-9M14 20H5M15 4L9 20",
  chevDown:   "M19 9l-7 7-7-7",
  video:      "M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
};

const navItems = [
  { key: "basics",    label: "Basics",      sub: "15 mins",                    icon: icons.basics,    active: true },
  { key: "avail",     label: "Availability", sub: "Working hours",             icon: icons.avail },
  { key: "limits",    label: "Limits",       sub: "How often you can be booked", icon: icons.limits },
  { key: "advanced",  label: "Advanced",     sub: "Calendar settings & more…", icon: icons.advanced },
  { key: "recurring", label: "Recurring",    sub: "Set up a repeating schedule", icon: icons.recurring },
  { key: "apps",      label: "Apps",         sub: "0 apps, 0 active",          icon: icons.apps },
  { key: "workflows", label: "Workflows",    sub: "0 active",                  icon: icons.workflows },
  { key: "webhooks",  label: "Webhooks",     sub: "0 active",                  icon: icons.webhooks },
];

// ── Toggle switch ────────────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: on ? "#fff" : "#3a3a3a",
        border: "none", cursor: "pointer", position: "relative",
        transition: "background .2s", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3,
        left: on ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: on ? "#000" : "#888",
        transition: "left .2s",
      }} />
    </button>
  );
}

// ── Section card wrapper ─────────────────────────────────────────────────────
function Section({ children }) {
  return (
    <div style={{
      background: "#111", border: "1px solid #222",
      borderRadius: 16, padding: "28px 32px", marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <p style={{ fontSize: 13, color: "#888", marginBottom: 8, fontWeight: 500 }}>
      {children}
    </p>
  );
}

const inputStyle = {
  width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a",
  borderRadius: 10, padding: "10px 14px", color: "#fff",
  fontSize: 14, outline: "none", boxSizing: "border-box",
  fontFamily: "inherit",
};

// ── Main component ───────────────────────────────────────────────────────────
function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(true);
  const [multiDuration, setMultiDuration] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [event, setEvent] = useState({ title: "", description: "", duration: "" });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventById(id);
        setEvent(res.data);
      } catch (err) {
        setError("Failed to load event.");
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) =>
    setEvent({ ...event, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateEvent(id, {
        title: event.title,
        description: event.description,
        duration: Number(event.duration),
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      background: "#0b0b0b", color: "#fff",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>

      {/* ── TOP NAV BAR ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px", height: 60,
        borderBottom: "1px solid #1e1e1e", flexShrink: 0,
      }}>
        {/* Left: back + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate("/")}
            style={{ background: "none", border: "none", color: "#888", cursor: "pointer", padding: 4 }}
          >
            <Icon d={icons.back} />
          </button>
          <span style={{ fontWeight: 600, fontSize: 16 }}>{event.title || "Event"}</span>
        </div>

        {/* Right: toggle + actions + save */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Toggle on={enabled} onChange={setEnabled} />

          <div style={{ width: 1, height: 24, background: "#2a2a2a" }} />

          {/* Action icons */}
          {[icons.external, icons.link, icons.code, icons.trash].map((d, i) => (
            <button key={i} style={{
              background: "none", border: "none", color: "#888",
              cursor: "pointer", padding: 6, borderRadius: 8,
              display: "flex", alignItems: "center",
              transition: "color .15s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "#888"}
            >
              <Icon d={d} />
            </button>
          ))}

          <div style={{ width: 1, height: 24, background: "#2a2a2a" }} />

          {error && (
            <span style={{ color: "#f87171", fontSize: 13 }}>{error}</span>
          )}

          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: saving ? "#333" : "#fff",
              color: saving ? "#888" : "#000",
              border: "none", borderRadius: 10,
              padding: "8px 20px", fontWeight: 600, fontSize: 14,
              cursor: saving ? "not-allowed" : "pointer",
              transition: "background .2s, color .2s",
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: 280, flexShrink: 0,
          borderRight: "1px solid #1e1e1e",
          overflowY: "auto", padding: "16px 12px",
        }}>
          {navItems.map(item => (
            <div key={item.key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", borderRadius: 12, marginBottom: 4,
              background: item.active ? "#1e1e1e" : "transparent",
              cursor: "pointer", transition: "background .15s",
              color: item.active ? "#fff" : "#666",
            }}
              onMouseEnter={e => { if (!item.active) e.currentTarget.style.background = "#161616"; }}
              onMouseLeave={e => { if (!item.active) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ color: item.active ? "#fff" : "#555" }}>
                  <Icon d={item.icon} size={17} />
                </span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: item.active ? 600 : 400, margin: 0, color: item.active ? "#fff" : "#aaa" }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 11, color: "#555", margin: 0, marginTop: 2 }}>
                    {item.sub}
                  </p>
                </div>
              </div>
              {item.active && <Icon d={icons.chevRight} size={14} />}
            </div>
          ))}
        </div>

        {/* ── MAIN FORM ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 40px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>

            {/* Title + Description + URL */}
            <Section>
              {/* Title */}
              <div style={{ marginBottom: 24 }}>
                <Label>Title</Label>
                <input
                  name="title"
                  value={event.title}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="Quick meeting"
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: 24 }}>
                <Label>Description</Label>
                {/* Toolbar */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "#0d0d0d", border: "1px solid #2a2a2a",
                  borderBottom: "none", borderRadius: "10px 10px 0 0",
                  padding: "6px 10px",
                }}>
                  {/* Normal dropdown */}
                  <button style={{
                    background: "none", border: "none", color: "#888",
                    cursor: "pointer", fontSize: 13, padding: "4px 8px",
                    display: "flex", alignItems: "center", gap: 4, borderRadius: 6,
                  }}>
                    Normal <Icon d={icons.chevDown} size={12} />
                  </button>
                  <div style={{ width: 1, height: 16, background: "#2a2a2a", margin: "0 4px" }} />
                  {[icons.bold, icons.italic, icons.link].map((d, i) => (
                    <button key={i} style={{
                      background: "none", border: "none", color: "#666",
                      cursor: "pointer", padding: 6, borderRadius: 6, display: "flex",
                    }}>
                      <Icon d={d} size={15} />
                    </button>
                  ))}
                </div>
                <textarea
                  name="description"
                  value={event.description || ""}
                  onChange={handleChange}
                  rows={4}
                  placeholder="A brief description of the event..."
                  style={{ ...inputStyle, borderRadius: "0 0 10px 10px", resize: "vertical" }}
                />
              </div>

              {/* URL */}
              <div>
                <Label>URL</Label>
                <input
                  value={`cal.com/yourname/${event.title?.toLowerCase().replace(/\s+/g, "-") || ""}`}
                  disabled
                  style={{ ...inputStyle, color: "#555" }}
                />
              </div>
            </Section>

            {/* Duration */}
            <Section>
              <Label>Duration</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <input
                  name="duration"
                  type="number"
                  value={event.duration}
                  onChange={handleChange}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <span style={{ color: "#555", fontSize: 14, whiteSpace: "nowrap" }}>Minutes</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
                <Toggle on={multiDuration} onChange={setMultiDuration} />
                <span style={{ fontSize: 13, color: "#777" }}>Allow multiple durations</span>
              </div>
            </Section>

            {/* Location */}
            <Section>
              <Label>Location</Label>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#0d0d0d", border: "1px solid #2a2a2a",
                borderRadius: 10, padding: "10px 14px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon d={icons.video} size={16} />
                  <span style={{ fontSize: 14 }}>Cal Video (Default)</span>
                </div>
                <Icon d={icons.chevDown} size={14} />
              </div>
              <p style={{ fontSize: 12, color: "#555", marginTop: 10, cursor: "pointer" }}>
                Show advanced settings ↓
              </p>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEvent;