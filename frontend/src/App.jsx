import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import EventTypes from "./pages/EventTypes";
import Availability from "./pages/Availability";
import WorkingHours from "./pages/WorkingHours";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";
import EditEvent from "./pages/EditEvent";
function App() {
  return (
    <Router>
      <Routes>

        {/* 🔥 PUBLIC ROUTE (NO SIDEBAR) */}
        <Route path="/book/:slug" element={<BookingPage />} />

        {/* 🔥 DASHBOARD ROUTES (WITH SIDEBAR) */}
        <Route
          path="/*"
          element={
            <div
              style={{
                display: "flex",
                height: "100vh",
                overflow: "hidden",
                background: "#0b0b0c",
              }}
            >
              {/* Sidebar */}
              <Sidebar />

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "24px 32px",
                  color: "white",
                }}
              >
                <Routes>
                  <Route path="/" element={<EventTypes />} />
                  <Route path="/availability" element={<Availability />} />
                  <Route path="/availability/edit" element={<WorkingHours />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                  <Route path="/event/edit/:id" element={<EditEvent />} />

                </Routes>
              </div>
            </div>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;