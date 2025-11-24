import express from "express";
import Bus from "../models/busModel.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   GET /api/buses/search
 * @desc    Search buses by from/to/date
 * @access  Public
 */
/**
 * @route   GET /api/buses/search
 * @desc    Search buses including intermediate stations
 * @access  Public
 */
router.get("/search", async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ message: "from, to, and date are required" });
    }

    const selectedDate = new Date(date);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const buses = await Bus.find({
      date: { $gte: selectedDate, $lt: nextDay },
      isActive: true,
    });

    const results = [];

    buses.forEach((bus) => {
      let startPoint = null;
      let endPoint = null;

      // 1️⃣ START POINT CHECK (from)
      if (bus.from.toLowerCase() === from.toLowerCase()) {
        // main route start
        startPoint = {
          station: bus.from,
          departureTime: bus.departureTime,
          priceFromStart: 0,
        };
      } else {
        // intermediate start
        const s = bus.intermediateStations.find(
          (st) => st.stationName.toLowerCase() === from.toLowerCase()
        );
        if (s) {
          startPoint = {
            station: s.stationName,
            departureTime: s.departureTime,
            priceFromStart: s.priceFromStart,
          };
        }
      }

      if (!startPoint) return; // no match, skip bus

      // 2️⃣ END POINT CHECK (to)
      if (bus.to.toLowerCase() === to.toLowerCase()) {
        // main route end
        endPoint = {
          station: bus.to,
          arrivalTime: bus.arrivalTime,
          priceFromStart: bus.price,
        };
      } else {
        // intermediate end
        const e = bus.intermediateStations.find(
          (st) => st.stationName.toLowerCase() === to.toLowerCase()
        );
        if (e) {
          endPoint = {
            station: e.stationName,
            arrivalTime: e.arrivalTime,
            priceFromStart: e.priceFromStart,
          };
        }
      }

      if (!endPoint) return;

      // 3️⃣ Validate that user isn't traveling backwards
      if (endPoint.priceFromStart <= startPoint.priceFromStart) return;

      // 4️⃣ Segment price
      const segmentPrice = endPoint.priceFromStart - startPoint.priceFromStart;

      // 5️⃣ Prepare result with MAIN ROUTE TIMES (as required)
      results.push({
        ...bus.toObject(),
        searchSegment: {
          from: startPoint.station,
          to: endPoint.station,
          departureTime: startPoint.departureTime,
          arrivalTime: endPoint.arrivalTime,
          segmentPrice,
        },
      });
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Server error while fetching buses" });
  }
});


/**
 * @route   GET /api/buses/suggestions
 * @desc    Autocomplete suggestions for 'from' or 'to'
 * @access  Public
 */
router.get("/suggestions", async (req, res) => {
  try {
    const { type, query } = req.query;
    if (!type || !query) return res.status(400).json([]);
    const field = type === "to" ? "to" : "from";
    const buses = await Bus.find({ [field]: { $regex: query, $options: "i" } });
    const suggestions = [...new Set(buses.map((b) => b[field]))];
    res.json(suggestions);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json([]);
  }
});

/**
 * @route   GET /api/buses/:id
 * @desc    Get a single bus by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (error) {
    console.error("Error fetching bus by ID:", error);
    res.status(500).json({ message: "Failed to fetch bus" });
  }
});

/**
 * @route   GET /api/buses
 * @desc    Get all buses (Admin)
 * @access  Admin
 */
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const buses = await Bus.find().sort({ date: 1 });
    res.json(buses);
  } catch (error) {
    console.error("Error fetching all buses:", error);
    res.status(500).json({ message: "Failed to fetch buses" });
  }
});

/**
 * @route   POST /api/buses
 * @desc    Add a new bus (Admin)
 * @access  Admin
 */
router.post("/", verifyAdmin, async (req, res) => {
  try {
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
      intermediateStations,
      isActive,
    } = req.body;

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
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newBus = new Bus({
      busName,
      busNumber,
      from,
      to,
      departureTime,
      arrivalTime,
      duration,
      date: new Date(date),
      price,
      totalSeats,
      availableSeats: totalSeats,
      category: category || "AC",
      seatingType: seatingType || "Seating",
      amenities: amenities || [],
      intermediateStations: intermediateStations || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({ message: "Failed to add new bus" });
  }
});

/**
 * @route   PUT /api/buses/:id
 * @desc    Update a bus (Admin)
 * @access  Admin
 */
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

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
      intermediateStations,
      isActive,
    } = req.body;

    bus.busName = busName ?? bus.busName;
    bus.busNumber = busNumber ?? bus.busNumber;
    bus.from = from ?? bus.from;
    bus.to = to ?? bus.to;
    bus.departureTime = departureTime ?? bus.departureTime;
    bus.arrivalTime = arrivalTime ?? bus.arrivalTime;
    bus.duration = duration ?? bus.duration;
    bus.date = date ? new Date(date) : bus.date;
    bus.price = price ?? bus.price;

    if (totalSeats) {
      const diff = totalSeats - bus.totalSeats;
      bus.availableSeats = Math.max(0, bus.availableSeats + diff);
      bus.totalSeats = totalSeats;
    }

    bus.category = category ?? bus.category;
    bus.seatingType = seatingType ?? bus.seatingType;
    bus.amenities = amenities ?? bus.amenities;
    bus.intermediateStations = intermediateStations ?? bus.intermediateStations;
    bus.isActive = isActive ?? bus.isActive;

    const updatedBus = await bus.save();
    res.json(updatedBus);
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({ message: "Failed to update bus" });
  }
});

/**
 * @route   DELETE /api/buses/:id
 * @desc    Delete a bus (Admin)
 * @access  Admin
 */
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    await bus.deleteOne();
    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bus:", error);
    res.status(500).json({ message: "Failed to delete bus" });
  }
});

export default router;
