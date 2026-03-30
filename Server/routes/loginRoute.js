import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  loginController,
  authenticateToken,
  logoutController
} from "../controllers/loginController.js";

const router = Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", loginRateLimiter, loginController);
router.get("/verify", authenticateToken, (req, res) => {
  res.status(200).json({ message: "User Authenticated", user: req.user });
});
router.post("/logout", authenticateToken, logoutController);

export default router;