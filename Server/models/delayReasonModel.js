import pool from "../databaseConfig/database.js";

export const insertDelayReason = async (taskId, username, reason) => {
  try {
    const [rows] = await pool.query(
      `INSERT INTO delay_reasons (task_id, username, reason, created_at) VALUES (?, ?, ?, NOW())`,
      [taskId, username, reason]
    );
    return rows;
  } catch (err) {
    console.error("Error inserting delay reason:", err);
    throw err;
  }
};