import PackageBooking from "../models/PackageBooking.js";
import asyncHandler from "express-async-handler";

// Create a new package booking
export const createBooking = async (req, res) => {
  try {
    const booking = new PackageBooking({
      user: req.user.id,
      ...req.body
    });

    await booking.save();
    res.status(201).json(booking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create package booking" });
  }
};

// Get bookings of the logged-in user
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await PackageBooking.find({ user: req.user.id, isCancelled: false });
    res.json(bookings);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load package bookings" });
  }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await PackageBooking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ message: "Package booking not found" });

    res.json(booking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load booking" });
  }
};

export const cancelPackageBooking = asyncHandler(async (req, res) => {
  const booking = await PackageBooking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error("Package Booking not found");
  }

  if (
    booking.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error("Not authorized to cancel");
  }

  if (booking.isCancelled) {
    res.status(400);
    throw new Error("Already cancelled");
  }

  booking.status = "Cancelled";
  booking.isCancelled = true;

  await booking.save();
  res.json({ message: "Package booking cancelled" });
});
