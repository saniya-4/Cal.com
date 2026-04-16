import { useState, useEffect } from "react";
import { getAvailability, saveAvailability } from "../api/api";

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const weekdays = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

const timeOptions = [
  "09:00","10:00","11:00","12:00",
  "13:00","14:00","15:00","16:00",
  "17:00","18:00"
];

const timezoneOptions = [
  { label: "India (IST)", value: "Asia/Kolkata" },
  { label: "USA - New York (EST)", value: "America/New_York" },
  { label: "UK - London (GMT)", value: "Europe/London" },
  { label: "UAE - Dubai (GST)", value: "Asia/Dubai" },
  { label: "Australia - Sydney (AEST)", value: "Australia/Sydney" },
];

const createSlot = () => ({ start: "09:00", end: "17:00" });

const dayToNumber = {
  Sunday: "0",
  Monday: "1",
  Tuesday: "2",
  Wednesday: "3",
  Thursday: "4",
  Friday: "5",
  Saturday: "6",
};

const numberToDay = {
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
};

function WorkingHours() {

  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const [availability, setAvailability] = useState({
    Sunday: [],
    Monday: [createSlot()],
    Tuesday: [createSlot()],
    Wednesday: [createSlot()],
    Thursday: [createSlot()],
    Friday: [createSlot()],
    Saturday: [],
  });

  // ✅ FETCH GLOBAL AVAILABILITY
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await getAvailability();
      const data = res.data;

      setTimezone(data.timezone || "Asia/Kolkata");

      const grouped = {
        Sunday: [], Monday: [], Tuesday: [], Wednesday: [],
        Thursday: [], Friday: [], Saturday: [],
      };

      (data.slots || []).forEach((slot) => {
        const day = numberToDay[String(slot.day)];
        if (!day) return;

        grouped[day].push({
          start: slot.startTime.slice(0, 5),
          end: slot.endTime.slice(0, 5),
        });
      });

      weekdays.forEach((day) => {
        if (grouped[day].length === 0) grouped[day] = [createSlot()];
      });

      setAvailability(grouped);

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const toggleDay = (day) => {
    if (weekdays.includes(day)) return;

    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].length ? [] : [createSlot()],
    }));
  };

  const addSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...prev[day], createSlot()],
    }));
  };

  const removeSlot = (day, index) => {
    setAvailability((prev) => {
      const updated = prev[day].filter((_, i) => i !== index);

      if (weekdays.includes(day) && updated.length === 0) {
        return { ...prev, [day]: [createSlot()] };
      }

      return { ...prev, [day]: updated };
    });
  };

  const updateTime = (day, index, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  // ✅ SAVE GLOBAL
  const handleSave = async () => {
    const slots = [];

    Object.keys(availability).forEach((day) => {
      availability[day].forEach((slot) => {
        if (slot.start && slot.end) {
          slots.push({
            day: dayToNumber[day],
            startTime: slot.start,
            endTime: slot.end,
          });
        }
      });
    });

    try {
      await saveAvailability({
        timezone,
        slots,
      });

      alert("Saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Save failed");
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px 30px", color: "white" }}>
      <div style={{ flex: 2 }}>
        <h2>Working hours</h2>

        <div style={{ border: "1px solid #222", borderRadius: "16px", padding: "20px" }}>
          {days.map((day) => (
            <div key={day} style={{ marginBottom: "20px" }}>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  onClick={() => toggleDay(day)}
                  style={{
                    width: "40px",
                    height: "20px",
                    borderRadius: "20px",
                    background: availability[day].length ? "#fff" : "#333",
                    cursor: weekdays.includes(day) ? "not-allowed" : "pointer",
                    opacity: weekdays.includes(day) ? 0.5 : 1,
                    position: "relative"
                  }}
                >
                  <div style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "#000",
                    position: "absolute",
                    top: "1px",
                    left: availability[day].length ? "20px" : "2px",
                  }} />
                </div>

                <span style={{ minWidth: "100px" }}>{day}</span>
              </div>

              {availability[day].length > 0 && (
                <div>
                  {availability[day].map((slot, index) => (
                    <div key={index} style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "10px",
                      marginLeft: "50px",
                      alignItems: "center"
                    }}>
                      <select
                        value={slot.start}
                        onChange={(e) => updateTime(day, index, "start", e.target.value)}
                        style={inputStyle}
                      >
                        {timeOptions.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>

                      <span>-</span>

                      <select
                        value={slot.end}
                        onChange={(e) => updateTime(day, index, "end", e.target.value)}
                        style={inputStyle}
                      >
                        {timeOptions.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>

                      {index === availability[day].length - 1 && (
                        <button onClick={() => addSlot(day)} style={iconBtn}>+</button>
                      )}

                      {(availability[day].length > 1 || !weekdays.includes(day)) && (
                        <button onClick={() => removeSlot(day, index)} style={iconBtn}>🗑</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, marginLeft: "40px" }}>
        <h3>Timezone</h3>

        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          style={inputStyle}
        >
          {timezoneOptions.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            background: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  background: "#111",
  border: "1px solid #222",
  color: "white",
  padding: "8px 10px",
  borderRadius: "10px"
};

const iconBtn = {
  background: "#111",
  border: "1px solid #222",
  color: "white",
  borderRadius: "6px",
  padding: "5px 8px",
  cursor: "pointer"
};

export default WorkingHours;