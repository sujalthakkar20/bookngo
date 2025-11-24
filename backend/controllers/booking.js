
// controllers/booking.js
import asyncHandler from "express-async-handler";
import Booking from "../models/bookingModel.js";
import Bus from "../models/busModel.js";

// Create booking (private)
export const createBooking = asyncHandler(async (req, res) => {
  const { 
    busId, 
    seats, 
    travelDate, 
    contactName, 
    contactEmail, 
    contactPhone, 
    paymentMethod,
    fromStation,
    toStation
  } = req.body;

  if (!busId || !seats || seats.length === 0 || !travelDate || !contactName) {
    res.status(400);
    throw new Error("Bus, seats, travel date, and contact name are required");
  }

  const bus = await Bus.findById(busId);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  if (bus.availableSeats < seats.length) {
    res.status(400);
    throw new Error("Not enough seats available");
  }

  // -------------------------------
  // ⭐ Robust Segment Calculation
  // -------------------------------

  // Build full ordered route (from main start, intermediate stations, to main end)
  const allStations = [
    { stationName: bus.from, departureTime: bus.departureTime, arrivalTime: bus.departureTime, priceFromStart: 0 },
    ...(bus.intermediateStations || []).map(st => ({
      stationName: st.stationName,
      departureTime: st.departureTime,
      arrivalTime: st.arrivalTime,
      priceFromStart: st.priceFromStart
    })),
    { stationName: bus.to, departureTime: bus.arrivalTime, arrivalTime: bus.arrivalTime, priceFromStart: bus.price }
  ];

  // Find from and to stations
  const fromObj = allStations.find(s => s.stationName.toLowerCase() === (fromStation || bus.from).toLowerCase());
  const toObj = allStations.find(s => s.stationName.toLowerCase() === (toStation || bus.to).toLowerCase());

  if (!fromObj || !toObj) {
    res.status(400);
    throw new Error("Invalid fromStation or toStation");
  }

  const fromIndex = allStations.indexOf(fromObj);
  const toIndex = allStations.indexOf(toObj);

  if (fromIndex >= toIndex) {
    res.status(400);
    throw new Error("fromStation must come before toStation in route");
  }

  // Segment price = difference of priceFromStart
  const segmentPrice = (toObj.priceFromStart || 0) - (fromObj.priceFromStart || 0);

  // Segment times with robust fallback
  const segmentDeparture = fromObj.departureTime || fromObj.arrivalTime || bus.departureTime;
  const segmentArrival = toObj.arrivalTime || toObj.departureTime || bus.arrivalTime;

  const totalPrice = seats.length * segmentPrice;

  // -------------------------------
  // Save booking
  // -------------------------------
  const booking = new Booking({
    user: req.user._id,
    userName: req.user.name,
    bus: bus._id,
    busName: bus.busName,
    seatsBooked: seats,
    totalPrice,
    travelDate,
    contactName,
    contactEmail,
    contactPhone,
    paymentMethod,
    fromStation: fromObj.stationName,
    toStation: toObj.stationName,
    segmentDeparture,
    segmentArrival,
    segmentPrice
  });

  // Update bus seat availability
  bus.availableSeats -= seats.length;
  await bus.save();

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});


// Get bookings for logged-in user
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
    isCancelled: false
  })
    .populate("bus", "busName from to departureTime arrivalTime intermediateStations");

  res.json(bookings);
});

// Admin: get all bookings
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate("user", "name email")
    .populate("bus");
  res.json(bookings);
});

// get booking by id (owner or admin)
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email")
    .populate("bus");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (
    booking.user._id.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }

  res.json(booking);
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("bus");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  // Only User or Admin can cancel
  if (
    booking.user.toString() !== req.user._id.toString() &&
    !req.user.isAdmin
  ) {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }

  if (booking.isCancelled) {
    res.status(400);
    throw new Error("Booking already cancelled");
  }

  // ---------------------------
  // ❌ Prevent cancel if departure passed
  // ---------------------------

  const today = new Date();
  const travelDate = new Date(booking.travelDate);

  // Merge date + time
  const [hours, minutes] = booking.segmentDeparture.split(":");
  travelDate.setHours(hours);
  travelDate.setMinutes(minutes);

  if (today > travelDate) {
    res.status(400);
    throw new Error("Cannot cancel after the bus departure time");
  }

  // ---------------------------
  // Perform cancellation
  // ---------------------------
  booking.status = "Cancelled";
  booking.isCancelled = true;

  // Restore seats
  const bus = booking.bus;
  bus.availableSeats += booking.seatsBooked.length;
  await bus.save();

  await booking.save();

  res.json({ message: "Booking cancelled successfully" });
});
