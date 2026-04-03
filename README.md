# Task Management System

A role-based full-stack task management platform built with **React**, **Node.js**, **Express.js**, and **MySQL**.

The system is designed to help teams manage work more efficiently by allowing **Admins** to manage users, **Managers** to create and assign tasks, and **Users** to update progress, log time, upload files, and explain delays.

---

## Why I Built This

Many teams still track tasks informally through chats, spreadsheets, or manual follow-ups. This project provides a centralized system for:

- assigning tasks clearly
- monitoring deadlines
- tracking work progress
- recording delays and updates
- improving accountability across a team

---

## Key Features

### Authentication & Roles
- Secure login system
- Role-based access control
- Separate permissions for:
  - **Admin**
  - **Manager**
  - **User**

### Task Management
- Create, edit, and delete tasks
- Assign tasks to specific users
- Set **priority levels**
- Set **due dates / deadlines**
- Organize tasks by **category**

### Progress Tracking
- Update task status
- Track overdue tasks
- Record **delay reasons**
- View task history and updates

### Collaboration
- Add comments and notes to tasks
- Upload task-related files and attachments

### Time Tracking
- Start and stop task timers
- Log time spent on tasks
- Compare estimated vs actual task effort

### Reporting
- Generate task summaries
- View workload distribution per user
- Monitor overall task progress

---

## User Roles

### Admin
Responsible for user management and access control.

**Capabilities:**
- Create users
- Manage user accounts
- Control role assignment

### Manager
Responsible for planning and monitoring work.

**Capabilities:**
- Create tasks
- Assign tasks to users
- Set deadlines and priorities
- Monitor progress and overdue tasks
- Review reports and workload

### User
Responsible for executing assigned work.

**Capabilities:**
- View assigned tasks
- Update task status
- Add comments and notes
- Record delay reasons
- Upload files
- Log time spent on tasks

---

## Tech Stack

### Frontend
- **React.js**
- **Vite**
- **CSS / Tailwind CSS**

### Backend
- **Node.js**
- **Express.js**

### Database
- **MySQL**

### Supporting Tools
- **JWT** – authentication
- **bcrypt** – password hashing
- **Axios** – API requests
- **Multer** – file uploads

---

## Project Structure

```bash
task-management-system/
│
├── client/                 # React frontend
│   ├── src/
│   └── package.json
│
├── server/                 # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── uploads/
│   └── package.json
│
├── database/               # SQL scripts / schema
│   └── task_management.sql
│
├── .env
└── README.md

------

## Future Improvements
- Email notifications
- Real-time updates
- Kanban board
- Dashboard analytics
- Calendar integration
- Mobile responsiveness improvements
