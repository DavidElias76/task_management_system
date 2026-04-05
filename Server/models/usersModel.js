import pool from "../databaseConfig/database.js";

export const getUsers = async () => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        return rows;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; 
    }
}

export const addUsers = async (username, email, password, role, created_at) => {
    try {
        const [rows] = await pool.query(
            "INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)", 
            [username, email, password, role, created_at]
        );
        return rows;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error; 
    }
}

export const updateUsers = async (id, username, email, password, role, created_at) => {
    try {
        const [rows] = await pool.query(
            "UPDATE users SET username = ?, email = ?, password = ?, role = ?, created_at = ? WHERE id = ?",
            [username, email, password, role, created_at, id]
        );
        return rows;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export const deleteUsers = async (id) => {
  try {
    const [rows] = await pool.query("SELECT username FROM users WHERE id = ?", [id]);
    
    if (rows.length === 0) throw new Error("User not found");
    
    const username = rows[0].username;

    await pool.query(`
      DELETE tl, c, a, dr 
      FROM tasks t
      LEFT JOIN time_logs tl ON tl.task_id = t.id
      LEFT JOIN comments c ON c.task_id = t.id
      LEFT JOIN attachments a ON a.task_id = t.id
      LEFT JOIN delay_reasons dr ON dr.task_id = t.id
      WHERE t.assignee = ?`, [username]);

    await pool.query("DELETE FROM tasks WHERE assignee = ?", [username]);

    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    
    return result;
  } catch (error) {
    console.error("Error deleting the user", error);
    throw error;
  }
};