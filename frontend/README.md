🚀 Cal.com Clone (Full Stack Booking App)

A full-stack scheduling and booking application inspired by Cal.com.
Users can create events, set availability, share booking links, and manage bookings.

📌 Features
🔹 Public Booking Page
Calendar-based date selection
Dynamic time slots based on availability
Booking form (Name, Email, Notes)
Prevents double booking
Booking confirmation page
Email notification on booking
🔹 Dashboard (Admin)
Create / Edit / Delete event types
Set availability (working hours)
Generate booking links
Toggle event active/inactive
🔹 Bookings Management
View Upcoming bookings
View Past bookings
View Cancelled bookings
Cancel bookings
🔹 Backend Features
REST APIs (Node.js + Express)
Sequelize ORM (MySQL)
Slot generation logic
Email sending via Nodemailer
🛠 Tech Stack
Frontend
React (Vite)
React Router
Axios
CSS (Custom UI)
Backend
Node.js
Express.js
Sequelize ORM
MySQL
Other Tools
Nodemailer (Email)
Slugify (URL generation)
📁 Project Structure
project-root/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.jsx
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
└── README.md
⚙️ Installation
🔹 1. Clone Repository
git clone https://github.com/your-username/cal-clone.git
cd cal-clone
🔹 2. Backend Setup
cd backend
npm install
Create .env
PORT=5000
DB_NAME=cal_clone
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
🔹 3. Start Backend
npm run dev
🔹 4. Frontend Setup
cd frontend
npm install
npm run dev