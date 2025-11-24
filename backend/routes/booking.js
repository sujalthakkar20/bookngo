import express from "express";
import { protect, verifyAdmin } from "../middleware/auth.js";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  cancelBooking
} from "../controllers/booking.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/mybookings", protect, getMyBookings);
router.get("/", protect, verifyAdmin, getAllBookings);
router.get("/:id", protect, getBookingById);
router.put("/cancel/:id", protect, cancelBooking);


export default router;
