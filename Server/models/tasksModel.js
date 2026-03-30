
import pool from "../databaseConfig/database.js";

export const getTasks = async () => {
    try{
        const [rows] = await pool.query("SELECT * FROM tasks");
        return rows;

    }catch(error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

export const addTasks = async (title, description, priority, created_at, due, status, assignee, category, estimated_hours, created_by) => {
    try{
       const [result] = await pool.query(
            "INSERT INTO tasks (title, description, priority, created_at, due, status, assignee, category, estimated_hours, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [title, description, priority, created_at, due, status, assignee, category, estimated_hours, created_by]
        );
        return result;
    }catch(error){
        console.error('Error adding task:', error);
        throw error;
    }
}

export const updateTasks = async (id, title, description, priority, due, status, assignee, category, estimated_hours, created_by) => {
    try {
        const [result] = await pool.query(
        `UPDATE tasks 
            SET title = ?,
                description = ?,
                priority = ?,
                due = ?,
                status = ?,
                assignee = ?,
                category = ?,
                estimated_hours = ?,
                created_by = ?
            WHERE id = ?`,
        [title, description, priority, due, status, assignee, category, estimated_hours, created_by, id]
    );
    return result;

    } catch (error) {
        console.error("Failed updating task", error);
        throw error;
    }
};

export const deleteTasks = async (id) => {
    try {
        await pool.query("DELETE FROM delay_reasons WHERE task_id = ?", [id]);
        await pool.query("DELETE FROM time_logs  WHERE task_id = ?", [id]);
        await pool.query("DELETE FROM comments WHERE task_id = ?", [id]);
        await pool.query("DELETE FROM attachments WHERE task_id = ?", [id]);
 
        const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
        return result;
    } catch(error) {
        console.error("Error deleting the task", error);
        throw error;
    }
}