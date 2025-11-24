import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Verify user token
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

// Only admin
export const verifyAdmin = async (req, res, next) => {
  await protect(req, res, () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }
    next();
  });
};
