import { getUsers } from "../models/usersModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const TOKEN_EXPIRY_SECONDS = 1 * 60 * 60; 

export const loginController = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const users = await getUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials, try again!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials, try again!" });
    }

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: TOKEN_EXPIRY_SECONDS,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: TOKEN_EXPIRY_SECONDS * 1000,
    });

    res.status(200).json({message: "Login successful", user});
};

export const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
};

export const logoutController = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};