import { useState } from "react";
import { createEvent } from "../api/api";
import "./CreateModal.css";

function CreateEventModal({ close, refresh }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: 15,
  });

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    await createEvent(form);
    refresh();
    close();
  };

  const slug = form.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return (
    <div className="modal-overlay">
      <div className="create-modal">

        <h2>Add a new event type</h2>
        <p className="subtitle">
          Set up event types to offer different types of meetings.
        </p>

        <label>Title</label>
        <input
          className="input"
          placeholder="Quick chat"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <label>URL</label>
        <input
          className="input"
          value={`https://cal.com/your-name/${slug}`}
          readOnly
        />

        <label>Description</label>
        <textarea
          className="textarea"
          placeholder="A quick video meeting."
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <label>Duration</label>
        <div className="duration-box">
          <input
            type="number"
            value={form.duration}
            onChange={(e) =>
              setForm({ ...form, duration: e.target.value })
            }
          />
          <span>minutes</span>
        </div>

        <div className="modal-footer">
          <button className="close-btn" onClick={close}>
            Close
          </button>

          <button className="continue-btn" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateEventModal;