// controllers/walletController.js
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// GET /api/wallet
export const getWallet = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  res.json({
    walletBalance: user.walletBalance || 0,
    transactions: user.transactions || [],
  });
});

// POST /api/wallet/add
export const addMoneyToWallet = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) throw new Error("User not found");
  if (!amount || amount <= 0) throw new Error("Invalid amount");

  user.walletBalance = (user.walletBalance || 0) + Number(amount);
  user.transactions = [
    ...(user.transactions || []),
    { type: "Add", amount: Number(amount), date: new Date() },
  ];

  await user.save();
  res.json({
    walletBalance: user.walletBalance,
    transactions: user.transactions,
  });
});

// POST /api/wallet/deduct
export const deductMoneyFromWallet = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) throw new Error("User not found");
  if (!amount || amount <= 0) throw new Error("Invalid amount");
  if (user.walletBalance < amount) throw new Error("Insufficient balance");

  user.walletBalance -= Number(amount);
  user.transactions = [
    ...(user.transactions || []),
    { type: "Deduct", amount: Number(amount), date: new Date() },
  ];

  await user.save();
  res.json({
    walletBalance: user.walletBalance,
    transactions: user.transactions,
  });
});
