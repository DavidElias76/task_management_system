
import pool from "../databaseConfig/database.js";

export const insertComment = async (taskId, username, body) => {

  try {
    const [rows] = await pool.query(
      `INSERT INTO comments (task_id, user_id, body) VALUES (?, ?, ?)`,
      [taskId, username, body]
    );
    return rows;
  } catch (err) {
    console.error("Error inserting comment:", err);
    throw err;
  }
};