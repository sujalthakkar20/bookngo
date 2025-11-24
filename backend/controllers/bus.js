import asyncHandler from "express-async-handler";
import Bus from "../models/busModel.js";

// @desc    Create a new bus (admin)
export const createBus = asyncHandler(async (req, res) => {
  const {
    busName,
    busNumber,
    from,
    to,
    departureTime,
    arrivalTime,
    duration,
    date,
    price,
    totalSeats,
    category,
    seatingType,
    amenities,
    isActive,

    // ⭐ NEW FIELD
    intermediateStations
  } = req.body;

  // Validate required fields
  if (
    !busName ||
    !busNumber ||
    !from ||
    !to ||
    !departureTime ||
    !arrivalTime ||
    !duration ||
    !date ||
    !price ||
    !totalSeats
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // ⭐ Convert intermediate prices to numbers
  const processedStations =
    intermediateStations?.map((s) => ({
      stationName: s.stationName,
      arrivalTime: s.arrivalTime,
      departureTime: s.departureTime,
      priceFromStart: Number(s.priceFromStart),
    })) || [];

  const bus = new Bus({
    busName,
    busNumber,
    from,
    to,
    departureTime,
    arrivalTime,
    duration,
    date,
    price,
    totalSeats,
    availableSeats: totalSeats,
    category: category || "AC",
    seatingType: seatingType || "Seating",
    amenities: amenities || [],
    isActive: isActive ?? true,

    // ⭐ save nested stations
    intermediateStations: processedStations,
  });

  const createdBus = await bus.save();
  res.status(201).json(createdBus);
});

// @desc    Get all buses (public / admin)
export const getBuses = asyncHandler(async (req, res) => {
  const { from, to, date } = req.query;
  const filter = {};

  if (from) filter.from = from;
  if (to) filter.to = to;

  // *** FIX: Filter buses by selected day ***
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59);
    filter.date = { $gte: start, $lte: end };
  }

  const buses = await Bus.find(filter);
  res.json(buses);
});

// @desc    Get single bus by ID
export const getBusById = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (bus) {
    res.json(bus);
  } else {
    res.status(404);
    throw new Error("Bus not found");
  }
});

// @desc    Update bus (admin)
export const updateBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  const {
    busName,
    busNumber,
    from,
    to,
    departureTime,
    arrivalTime,
    duration,
    date,
    price,
    totalSeats,
    category,
    seatingType,
    amenities,
    isActive,

    // ⭐ NEW
    intermediateStations,
  } = req.body;

  bus.busName = busName ?? bus.busName;
  bus.busNumber = busNumber ?? bus.busNumber;
  bus.from = from ?? bus.from;
  bus.to = to ?? bus.to;
  bus.departureTime = departureTime ?? bus.departureTime;
  bus.arrivalTime = arrivalTime ?? bus.arrivalTime;
  bus.duration = duration ?? bus.duration;
  bus.date = date ?? bus.date;
  bus.price = price ?? bus.price;

  if (totalSeats) {
    const seatDiff = totalSeats - bus.totalSeats;
    bus.availableSeats = Math.max(0, bus.availableSeats + seatDiff);
    bus.totalSeats = totalSeats;
  }

  bus.category = category ?? bus.category;
  bus.seatingType = seatingType ?? bus.seatingType;
  bus.amenities = amenities ?? bus.amenities;
  bus.isActive = isActive ?? bus.isActive;

  // ⭐ UPDATE INTERMEDIATE STATIONS SAFELY
  if (Array.isArray(intermediateStations)) {
  bus.intermediateStations = intermediateStations.map((s) => ({
    stationName: s.stationName,
    arrivalTime: s.arrivalTime,
    departureTime: s.departureTime,
    priceFromStart: Number(s.priceFromStart),
  }));
}


  const updatedBus = await bus.save();
  res.json(updatedBus);
});

// @desc    Delete bus (admin)
export const deleteBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  await bus.deleteOne();
  res.json({ message: "Bus removed successfully" });
});
