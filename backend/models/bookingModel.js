import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    busName: { type: String, required: true },
    seatsBooked: [{ type: String, required: true }],
    totalPrice: { type: Number, required: true },
    travelDate: { type: Date, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    paymentMethod: { type: String, required: true },

    // ⭐ Intermediate Stations
    fromStation: { type: String, required: true },
    toStation: { type: String, required: true },
    segmentDeparture: { type: String, required: true },
    segmentArrival: { type: String, required: true },
    segmentPrice: { type: Number, required: true },

    // ⭐ Cancel Ticket Support
    status: {
      type: String,
      enum: ["Confirmed", "Cancelled"],
      default: "Confirmed",
    },

    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
