import mongoose from "mongoose";

const StationSchema = mongoose.Schema({
  stationName: { type: String, required: true },
  arrivalTime: { type: String, required: true },      // e.g. "20:00"
  departureTime: { type: String, required: true },    // e.g. "20:05"
  priceFromStart: { type: Number, required: true },   // price from main start point
});

const busSchema = mongoose.Schema(
  {
    busName: { type: String, required: true },
    busNumber: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: String, required: true },  
    arrivalTime: { type: String, required: true },    
    duration: { type: String, required: true },       
    date: { type: Date, required: true },             
    price: { type: Number, required: true },          
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    category: { type: String, default: "AC" },
    seatingType: { type: String, default: "Seating" },
    amenities: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },

    // ⭐ NEW FIELD — Intermediate Stations
    intermediateStations: {
      type: [StationSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bus", busSchema);
