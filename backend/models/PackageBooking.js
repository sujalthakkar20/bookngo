import mongoose from "mongoose";

const packageBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  place: String,
  days: String,
  hotel: String,
  roomType: String,
  busType: String,
  travelDate: Date,
  pickupPoint: String,
  facilities: [String],
  price: Number,
  paymentMethod: String,
  image: String,

  // ⭐ UPDATED status with allowed values
  status: {
    type: String,
    enum: ["Confirmed", "Cancelled"],
    default: "Confirmed"
  },

  // ⭐ Hide cancelled bookings
  isCancelled: {
    type: Boolean,
    default: false
  },

}, { timestamps: true });

export default mongoose.model("PackageBooking", packageBookingSchema);
