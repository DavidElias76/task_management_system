-- ─── 1. Users ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 2. Tasks (updated from your existing schema) ────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('low', 'medium', 'high') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due DATE NOT NULL,
    status ENUM('todo', 'in-progress', 'completed', 'trash') NOT NULL DEFAULT 'todo',
    assignee VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    estimated_hours VARCHAR(20),
    created_by VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignee) REFERENCES users(username) ON UPDATE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(username) ON UPDATE CASCADE
);
-- ─── 3. Task Status History ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS task_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    changed_by VARCHAR(50) NOT NULL,
    old_status ENUM('todo', 'in-progress', 'completed', 'trash') NOT NULL,
    new_status ENUM('todo', 'in-progress', 'completed', 'trash') NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(username) ON UPDATE CASCADE
);

-- ─── 4. Time Logs ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS time_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP DEFAULT NULL,
    duration_minutes INT DEFAULT 0,
    note TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(username) ON UPDATE CASCADE
);

-- ─── 5. Attachments ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    uploaded_by VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_data LONGBLOB NOT NULL,
    file_size INT DEFAULT NULL,
    mime_type VARCHAR(100) DEFAULT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(username) ON UPDATE CASCADE
);

-- ─── 6. Comments ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(username) ON UPDATE CASCADE
);