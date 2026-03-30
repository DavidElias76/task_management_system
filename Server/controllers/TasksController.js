import { addTasks, getTasks, updateTasks, deleteTasks } from "../models/tasksModel.js";
import dotenv from "dotenv";
dotenv.config();

export const getTasksController = async (req, res) => {
    try{
        const fetchTasks = await getTasks();
        res.json(fetchTasks)
    }catch(error){
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
}

export const AddTasksController = async (req, res) => {
    try{
        const {title, description, priority, created_at, due, status, assignee, category, estimated_hours, created_by} = req.body;

        if(!title || !description || !priority || !created_at || !due || !status || !assignee || !category || !estimated_hours, !created_by){
            return res.status(400).json({message: 'Fill all the field required'})
        }

        const tasks = await getTasks();
        const existingTasks = tasks.find(task => task.title === title && task.priority === priority && task.due === due && task.status === status && task.assignee === assignee)

        if(existingTasks){
            return res.status(400).json({message: 'Task already exists'})
        }

        const task = await addTasks(title, description, priority, created_at, due, status, assignee, category, estimated_hours, created_by);
        if(!task){
            return res.status(500).json({message: 'Failed to add task'})
        }

        res.status(201).json({message: 'Task added successfully'})

    }catch(error){
        console.error('Error adding tasks', error)
        res.json({message: 'Failed to add tasks'})
    }
}

export const updateTaskController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      priority,
      due,
      status,
      assignee,
      category,
      estimated_hours,
      created_by
    } = req.body;

    if (!title || !description || !priority || !due || !status || !assignee || !category || !estimated_hours || !created_by) {
      return res.status(400).json({ message: 'Fill all the required fields' });
    }

    const tasks = await getTasks();
    const taskExists = tasks.find(t => t.id === Number(id));

    if (!taskExists) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const result = await updateTasks(
      id,
      title,
      description,
      priority,
      due,
      status,
      assignee,
      category,
      estimated_hours,
      created_by
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'Update failed' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
    console.log('Task updated successfully');

  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTasksController =  async (req, res) => {
    try{
        const {id} = req.params;
        const tasks = await getTasks()
        const task = tasks.find(t => t.id === Number(id))

        if(!task) {
            res.status(400).json({message : 'Deletion failed'})
        }

        const result = await deleteTasks(id)
        res.status(200).json({message: 'Task deleted successfully'}, result)

    }catch(error) {
        console.error("Error deleting the user", error)
    }
}