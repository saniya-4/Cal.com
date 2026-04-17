📅 Cal.com Clone (Meeting Scheduler)

A full-stack meeting scheduling application inspired by Cal.com. Users can create events, view availability, and book time slots seamlessly.

🚀 Tech Stack
Frontend: React.js
Backend: Node.js, Express.js
Database: MySQL
ORM: Sequelize
Deployment: Vercel (Frontend), Railway (Backend)
📌 Features
Create and manage event types
Define availability (days & time slots)
View available slots dynamically
Book meetings with date & time
Prevent double bookings
Email notification (optional / async)
⚙️ Setup Instructions
1. Clone the repository
git clone https://github.com/saniya-4/Cal.com
cd CAL.COM CLONE
2. Backend Setup
cd backend
npm install
Create .env file in backend:
PORT=5000
DATABASE_URL=your_mysql_connection_string
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
Run backend:
npm start
3. Frontend Setup
cd frontend
npm install
Create .env file in frontend:
VITE_API_URL=https://cal-1gfdc9ecf-saniyas-projects-ddb842a7.vercel.app/
Run frontend:
npm run dev
🌐 Deployment
Frontend deployed on Vercel
Backend deployed on Railway
MySQL database hosted on cloud (Railway / external)