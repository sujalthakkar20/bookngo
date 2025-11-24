import mongoose from "mongoose";

const transactionSchema = mongoose.Schema(
  {
    type: String, // Add / Deduct
    amount: Number,
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    isAdmin: { type: Boolean, default: false },
    walletBalance: { type: Number, default: 0 },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
