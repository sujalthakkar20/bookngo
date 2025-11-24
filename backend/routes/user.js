// routes/user.js
import express from "express";
import { registerUser, authUser, getUserProfile } from "../controllers/user.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);

export default router; 
