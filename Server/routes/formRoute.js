import { Router } from "express";
import pool from "../databaseConfig/database.js";
import { addUsersController } from "../controllers/UsersController.js";

const router = Router();

router.post('/', addUsersController)

// router.post('/', async (req, res) => {
//     const { title, description, priority, due, status, assignee, category, estimated_hours } = req.body;

//     if (!title || !priority || !due || !status || !assignee) {
//         return res.status(400).json({ error: "Please fill in all required fields" });
//     }

//     try {
//         const [rows] = await pool.query(`
//             INSERT INTO new_tasks (title, description, priority, due, status, assignee, category, estimated_hours)
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [title, description, priority, due, status, assignee, category, estimated_hours]
//         );

//         res.status(201).json({ message: "Task added successfully", id: rows.insertId });

//     } catch (error) {
//         console.error('Error adding task:', error);
//         res.status(500).json({ error: "Failed to add task" });
//     }
// });

export default router;