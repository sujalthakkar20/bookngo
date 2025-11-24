// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/userModel.js";
import Bus from "./models/busModel.js";
import Booking from "./models/bookingModel.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Booking.deleteMany();
    await Bus.deleteMany();
    await User.deleteMany();

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("123456", salt);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@bookngo.com",
      password: adminPassword,
      isAdmin: true,
    });

    console.log("✅ Admin user created:", adminUser.email);

    // Create sample buses
    const buses = [
      {
        busName: "GreenLine Express",
        from: "New York",
        to: "Boston",
        seatsTotal: 40,
        seatsAvailable: 40,
        price: 25,
        date: new Date("2025-11-15T09:00:00"),
      },
      {
        busName: "CityRide Deluxe",
        from: "Boston",
        to: "Chicago",
        seatsTotal: 50,
        seatsAvailable: 50,
        price: 45,
        date: new Date("2025-11-16T08:00:00"),
      },
      {
        busName: "Sunshine Travels",
        from: "Chicago",
        to: "New York",
        seatsTotal: 35,
        seatsAvailable: 35,
        price: 40,
        date: new Date("2025-11-17T07:30:00"),
      },
    ];

    await Bus.insertMany(buses);
    console.log("🚌 Sample buses inserted");

    console.log("✅ Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

// Optional: clear all data
const destroyData = async () => {
  try {
    await Booking.deleteMany();
    await Bus.deleteMany();
    await User.deleteMany();
    console.log("🧹 All data deleted!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Choose function based on argument
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
