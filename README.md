# TMS — Task Management System

A full-stack web application for managing tasks across teams, built with React 18, Node.js/Express, and MySQL. The system supports three roles — Admin, Manager, and User — each with their own dashboard, permissions, and workflow.

---

## Features

### Role-Based Access Control
- **Admin** — full access to users, tasks, and system settings
- **Manager** — create, assign, edit, and delete tasks; view team performance dashboard
- **User** — view and work on assigned tasks, track time, add comments, upload files

### Authentication
- JWT-based authentication — token signed on login and sent as an HTTP-only cookie
- Cookie automatically attached to every request via `withCredentials: true` in Axios
- Token verified on the backend for every protected route
- Logout clears the cookie and invalidates the session
- Role extracted from JWT payload to enforce access control

### Task Management
- Create, edit, and delete tasks with title, description, priority, due date, assignee, category, and estimated hours
- Real-time search with debounce across title, status, priority, and assignee
- Task status lifecycle: `todo` → `in-progress` → `completed`
- Priority color indicators: High (red), Medium (yellow), Low (green)
- Due date color coding: green if upcoming, red if overdue

### Task Panel (User Workflow)
- Full-screen task panel with timer, comments, attachments, and delay reason
- Start/stop timer with elapsed time display
- Auto-detects delay when time exceeds estimated hours
- Add comments with Enter key or Send button
- Upload PDF, Word, and Image attachments with staging and cancel
- Submit All — saves time logs, comments, attachments, and delay reason in one operation

### Dashboard
- Role-specific stats — Admins and Managers see team-wide data, Users see only their own
- Stat cards: To-Do, In Progress, Completed, Due Today, Overdue, Team Members
- Completion rate donut chart
- Priority split bar chart
- Team progress by assignee (Manager/Admin)
- Personal progress breakdown (User)
- Due Today and Overdue task lists
- Recent activity table

### Completed Tasks
- Grid of completed task cards with time log count, comment count, and attachment count
- Manager side panel with full task details, time logs, comments, attachments, and delay reasons
- User read-only view with attachment download

### User Management (Admin Only)
- Add, edit, and delete users
- Role assignment: Admin, Manager, User
- Search by username, email, or role

### Theme System
- Light and dark mode toggle
- Persists across sessions via `localStorage`
- All components use theme tokens from `ThemeContext`

### Notifications
- Top-right notification for all major actions (add, edit, delete, submit)
- Auto-dismisses after 3 seconds
- Manual dismiss via X button

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |
| React Router v6 | Client-side routing |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express.js | Web framework |
| MySQL2 | Database driver |
| Multer | File upload handling |
| jsonwebtoken | JWT token generation and verification |
| cookie-parser | Parse JWT token from HTTP-only cookies |
| dotenv | Environment variables |
| cors | Cross-origin requests |


### Database
- MySQL 8.x

---

## Project Structure

```
TMS/
├── Client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Sidebar, Navbar, Notification
│   │   │   ├── Modals/         # TaskModal, AddUserModal
│   │   │   └── Panels/         # TaskPanel, CompletedTaskPanel, Timer, Comments, Attachments, TimeLogs
│   │   ├── context/            # AuthContext, TasksContext, ThemeContext, TaskPanelContext
│   │   ├── data/               # Static data (roles, priorities, categories etc.)
│   │   ├── hooks/              # useDebounce
│   │   ├── pages/              # Dashboard, Tasks, InProgress, Completed, Users
│   │   └── utils/              # formatDate, exportPanel, dashboard helpers
│   └── index.html
│
└── Server/                     # Node.js backend
    ├── controllers/            # TasksController, UsersController, AuthController
    ├── models/                 # tasksModel, usersModel
    ├── routes/                 # task routes, user routes, auth routes
    ├── databaseConfig/         # MySQL connection pool
    └── server.js
```

---

## Database Schema

```sql
-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Manager', 'User') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  priority ENUM('high', 'medium', 'low') NOT NULL,
  status ENUM('todo', 'in-progress', 'completed', 'trash') DEFAULT 'todo',
  assignee VARCHAR(100),
  due DATE,
  category VARCHAR(100),
  estimated_hours VARCHAR(50),
  created_by VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignee) REFERENCES users(username) ON UPDATE CASCADE
);

-- Comments
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  username VARCHAR(100),
  body TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- Time Logs
CREATE TABLE time_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  username VARCHAR(100),
  started_at BIGINT,
  ended_at BIGINT,
  duration_minutes VARCHAR(50),
  note VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- Attachments
CREATE TABLE attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  file_name VARCHAR(255),
  file_size BIGINT,
  mime_type VARCHAR(100),
  uploaded_by VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);

-- Delay Reasons
CREATE TABLE delay_reasons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  username VARCHAR(100),
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/tms.git
cd tms
```

### 2. Set up the database
Create a MySQL database and run the schema above to create all tables.

```sql
CREATE DATABASE tms_db;
USE tms_db;
-- paste schema SQL here
```

### 3. Configure the backend
Create a `.env` file inside the `Server/` folder:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=tms_db
JWT_SECRET=your_jwt_secret_key_here
PORT=8080
```

### 4. Install backend dependencies
```bash
cd Server
npm install
```

### 5. Start the backend
```bash
node server.js
# or with nodemon
npx nodemon server.js
```

The backend will run on `http://localhost:8080`

### 6. Install frontend dependencies
```bash
cd Client
npm install
```

### 7. Start the frontend
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate user, sign JWT, set HTTP-only cookie |
| POST | `/api/auth/logout` | Clear JWT cookie and log out |
| GET | `/api/auth/me` | Verify JWT from cookie, return current user |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Fetch all tasks |
| POST | `/api/tasks/add` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete task and all related data |
| PUT | `/api/tasks/:id/status` | Update task status only |
| POST | `/api/tasks/:id/timelogs` | Save time logs |
| GET | `/api/tasks/timelogs` | Fetch all time logs |
| POST | `/api/tasks/:id/comments` | Save comments |
| GET | `/api/tasks/comments` | Fetch all comments |
| POST | `/api/tasks/:id/attachments` | Upload file attachments |
| GET | `/api/tasks/attachments` | Fetch all attachments |
| GET | `/api/tasks/attachments/:id/download` | Download an attachment |
| POST | `/api/tasks/:id/delay` | Save delay reason |
| GET | `/api/tasks/delays` | Fetch all delay reasons |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Fetch all users |
| POST | `/api/users/add` | Create a new user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | — |
| `DB_PASSWORD` | MySQL password | — |
| `DB_NAME` | Database name | `tms_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | — |
| `PORT` | Backend server port | `8080` |

---

## Screenshots

> Add screenshots of your dashboard, task board, task panel, and completed tasks here.

---

## License

This project is for academic and educational purposes.

---

## Author

Developed as part of a Task Management System project.