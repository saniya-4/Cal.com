import "./EmptyState.css";

function EmptyState() {
  return (
    <div className="empty-box">
      <div className="content">
        <div className="icon">🔗</div>

        <h3>Create your first event type</h3>

        <p>
          Event types enable you to share links that show available times
          on your calendar and allow people to make bookings with you.
        </p>

        <button>Create</button>
      </div>
    </div>
  );
}

export default EmptyState;