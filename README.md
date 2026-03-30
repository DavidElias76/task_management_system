
# Task Management System

A full-stack web application for managing tasks, assigning responsibilities, tracking progress, monitoring deadlines, and improving team workflow.

Built with **React**, **Node.js**, **Express.js**, and **MySQL**, this system helps organizations and teams manage tasks in a more structured and efficient way.

---

## Features

- User authentication and role-based access
- Task creation, editing, and deletion
- Task assignment to users
- Deadline and priority management
- Task progress tracking
- Overdue task monitoring
- Delay reason recording
- Comments and notes on tasks
- File upload support
- Time logging / task timer
- Workload visibility
- Task reporting and summaries

---

## Tech Stack

### Frontend
- React.js
- Vite
- CSS / Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Other Tools
- JWT Authentication
- bcrypt
- Axios
- Multer

---

## Project Structure

```bash
task-management-system/
│
├── client/         # React frontend
├── server/         # Node.js + Express backend
├── database/       # SQL scripts
├── .env
└── README.md

---

Installation
---
1. Clone the repository
git clone https://github.com/your-username/task-management-system.git
cd task-management-system
---
2. Setup the frontend
cd client
npm install
npm run dev
---
3. Setup the backend
cd server
npm install
npm run dev
---
4. Setup the database

Create a MySQL database:

CREATE DATABASE task_management_system;

Then import your SQL schema into MySQL.

Environment Variables

Create a .env file inside the server folder:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_management_system
JWT_SECRET=your_jwt_secret

---

Future Improvements
---
Email notifications
Real-time updates
Kanban board
Dashboard analytics
Calendar integration
Mobile responsiveness improvements

