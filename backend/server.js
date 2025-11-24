// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import busRoutes from "./routes/bus.js";
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";
import walletRoutes from "./routes/wallet.js";
import packageBookingRoutes from "./routes/packageBookingRoutes.js"


import { notFound, errorHandler } from "./middleware/error.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/wallet", walletRoutes);
app.use("/api/package-booking", packageBookingRoutes);


app.get("/", (req, res) => res.send("BookNGo API running"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
