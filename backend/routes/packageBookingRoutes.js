import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelPackageBooking
} from "../controllers/packageBookingController.js";

const router = express.Router();

router.post("/", protect, createBooking);        // Create booking
router.get("/me", protect, getMyBookings);      // User bookings
router.get("/:id", protect, getBookingById);    // Single booking
router.put("/cancel/:id", protect, cancelPackageBooking);


export default router;
