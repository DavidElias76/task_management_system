import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:8080";
const TasksContext = createContext();

function TasksProvider({ children }) {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/tasks`);
            setTasks(response.data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/users`);
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
    }, []);

    return (
        <TasksContext.Provider value={{ 
            tasks, 
            users, 
            loading, 
            error, 
            refetch: fetchTasks,        
            refetchUsers: fetchUsers  
        }}>
            {children}
        </TasksContext.Provider>
    );
}

export {TasksContext, TasksProvider}
