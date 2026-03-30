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
    try{
        const [rows] = await pool.query(
            "DELETE FROM users WHERE id = ?", [id]
        );
        return rows;

    }catch(error) {
        console.error('Error deleting the user:', error);
        throw error;
    }
}