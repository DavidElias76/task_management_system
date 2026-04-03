import dotenv from "dotenv";
dotenv.config();
import {updateTaskStatus, getTasksRows, addTaskStatusHistory} from "../models/statusChanger.js"

export const updateTaskStatusController = async (req, res) => {
    try{
        const {id} = req.params
        const {status, changed_by} = req.body;

        const allowedStatus = ['todo', 'in-progress', 'completed'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const taskRows = await getTasksRows(id);

        if (taskRows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        const oldStatus = taskRows[0].status

        const result = await updateTaskStatus(id, status)

        const addResult = await addTaskStatusHistory(id, changed_by, oldStatus, status)

        res.status(200).json({ message: "Task status updated", result, addResult}); 

    }catch(err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Failed to update the task status" });; 
    }
}