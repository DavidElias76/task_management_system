import pool from "../databaseConfig/database.js";

export const insertFile = async (taskId, uploaded_by, file_name, file_data, file_size, mime_type) => {
  try {
    const [rows] = await pool.query(
      `INSERT INTO attachments (task_id, uploaded_by, file_name, file_data, file_size, mime_type) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [taskId, uploaded_by, file_name, file_data, file_size, mime_type]
    );
    return rows;
  } catch (err) {
    console.error("Error inserting file:", err);
    throw err;
  }
};