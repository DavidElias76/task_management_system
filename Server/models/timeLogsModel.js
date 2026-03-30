
import pool from "../databaseConfig/database.js";

const toMySQLDateTime = (timestamp) => {
  return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
};

export const insertTimeLogs = async (taskId, username, started_at, ended_at, duration_ms, note, created_at) => {
  try {
    const [rows] = await pool.query(
      `INSERT INTO time_logs (task_id, user_id, started_at, ended_at, duration_minutes, note, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        taskId,
        username,
        toMySQLDateTime(started_at),
        toMySQLDateTime(ended_at),
        duration_ms,
        note,
        toMySQLDateTime(created_at),
      ]
    );
    return rows;
  } catch (error) {
    console.error("Error adding timeLogs history:", error);
    throw error;
  }
};