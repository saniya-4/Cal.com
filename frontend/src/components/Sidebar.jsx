import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div>
        <div className="user">
          <div className="avatar">S</div>
          <span>Saniya Garg</span>
        </div>

        <ul>
            <li onClick={() => navigate("/")}>🔗 Event types</li>
            <li onClick={() => navigate("/availability")}>⏰ Availability</li>
            <li onClick={() => navigate("/bookings")}>📅 Bookings</li>
          <li>👥 Teams</li>
          <li>📦 Apps</li>
          <li>➡ Routing</li>
          <li>⚡ Workflows</li>
          <li>📊 Insights</li>
        </ul>
      </div>

      <div className="footer">
        <p>↗ View public page</p>
        <p>📋 Copy public page link</p>
        <p>🎁 Refer and earn</p>
        <p>⚙ Settings</p>
        <span className="version">© 2026 Cal.com, Inc.</span>
      </div>
    </div>
  );
}

export default Sidebar;