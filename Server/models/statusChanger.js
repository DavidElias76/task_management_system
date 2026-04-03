import pool from "../databaseConfig/database.js";

export const getStatusHistory = async () => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM task_status_history ORDER BY changed_at DESC"
    );
    return rows;
  } catch (error) {
    console.error("Error getting the task history");
    throw error;
  }
};

export const getTasksRows = async (id) => {
  try {
    const [rows] = await pool.query(
      "SELECT status FROM tasks WHERE id = ?",
      [id]
    );
    return rows;
  } catch (error) {
    console.error("Error getting the task status");
    throw error;
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const [rows] = await pool.query(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [status, id]
    );
    return rows;
  } catch (error) {
    console.error("Error updating the task status");
    throw error;
  }
};

export const addTaskStatusHistory = async (id, changed_by, oldStatus, newStatus) => {
  try {
    const [rows] = await pool.query(
      `INSERT INTO task_status_history
      (task_id, changed_by, old_status, new_status, changed_at)
      VALUES (?, ?, ?, ?, NOW())`,
      [id, changed_by, oldStatus, newStatus]
    );

    return rows;
  } catch (error) {
    console.error("Error adding task status history");
    throw error;
  }
};