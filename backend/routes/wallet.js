// routes/wallet.js
import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getWallet,
  addMoneyToWallet,
  deductMoneyFromWallet,
} from "../controllers/wallet.js";

const router = express.Router();

router.get("/", protect, getWallet);          // Get user's wallet
router.post("/add", protect, addMoneyToWallet);  // Add money
router.post("/deduct", protect, deductMoneyFromWallet); // Deduct money

export default router;
