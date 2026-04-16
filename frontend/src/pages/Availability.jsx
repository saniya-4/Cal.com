import { useNavigate } from "react-router-dom";

function Availability() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Availability</h1>
      <p style={{ color: "#888" }}>
        Configure times when you are available for bookings.
      </p>

      {/* ✅ SINGLE GLOBAL CARD */}
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #222",
          borderRadius: "12px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/availability/edit")}
      >
        <h3>Working hours</h3>
        <p style={{ color: "#888" }}>
          Set your global availability
        </p>
        <p style={{ color: "#888" }}>Asia/Kolkata</p>
      </div>
    </div>
  );
}

export default Availability;