
import { addUsers, getUsers, updateUsers, deleteUsers } from "../models/usersModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = 10;

export const getUsersController = async (req, res) => {
    try {
        const fetchUser = await getUsers();
        res.json(fetchUser);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
}

export const addUsersController = async (req, res) => {
    try {
        const { username, email, password, role, created_at } = req.body;
        if (!username || !email || !password || !role || !created_at) {
            return res.status(400).json({ message: "Fill all the field required" });
        }

        const users = await getUsers();

        const existingUser = users.find(user => user.username === username);

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await addUsers(username, email, hashedPassword, role, created_at);
        if (!user) {
            return res.status(500).json({ message: "Failed to add user" });
        }
        res.status(201).json({ message: "User added successfully", user });

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: "Failed to add user" });
    }
}

export const updateUsersController = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role, created_at } = req.body;
        const users = await getUsers();
        const userExists = users.find(u => u.id === Number(id));

        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const result = await updateUsers(
            id,
            username,
            email,
            hashedPassword,
            role,
            created_at
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Update failed' });
        }

        res.status(200).json({ message: 'User updated successfully' });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUsersController = async (req, res) => {
    const {id} = req.params;

    const users = await getUsers();

    const userExists = users.find(u => u.id === Number(id))

    if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
    }

    const result = await deleteUsers(id)

    if (result.affectedRows === 0) {
        return res.status(400).json({ message: 'Deletion failed' });
    }

    res.status(200).json({message: "User deleted successfully"})

}