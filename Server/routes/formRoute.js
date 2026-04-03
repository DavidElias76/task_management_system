import { Router } from "express";
import pool from "../databaseConfig/database.js";
import { addUsersController } from "../controllers/UsersController.js";

const router = Router();

router.post('/', addUsersController)

export default router;