import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../pages/WalletContext";
import API from "../utils/api";
import { API_ENDPOINTS } from "../config/api";
import "./PackageBooking.css";

const PackageBooking = () => {
  const navigate = useNavigate();
  const { walletBalance, deductFromWallet } = useWallet();

  const [pkg, setPkg] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedPackage") || "null");

    if (!selected) {
      navigate("/packages");
      return;
    }

    setPkg(selected);
  }, [navigate]);

  if (!pkg) return <div>Loading package details...</div>;

  const totalAmount = pkg.price;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name || !formData.email || !formData.phone || !formData.paymentMethod) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    // Wallet payment
    if (formData.paymentMethod === "Wallet") {
      if (walletBalance < totalAmount) {
        setMessage("⚠️ Insufficient wallet balance.");
        return;
      }
      deductFromWallet(totalAmount);
    }

    // 🟢 FIXED DATA STRUCTURE (matches MongoDB schema)
    const bookingData = {
      place: pkg.place,
      days: pkg.days,
      hotel: pkg.hotel,
      roomType: pkg.roomType || "Standard Room",
      busType: pkg.bus || pkg.busType || "Sleeper Bus",
      facilities: pkg.facilities || pkg.facility || [],
      travelDate: new Date(), // packages have no fixed travel date
      pickupPoint: "Main Bus Stop",
      price: pkg.price,
      paymentMethod: formData.paymentMethod,
      image: pkg.image,

      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,

      status: "Confirmed",
    };

    try {
      const response = await API.post(API_ENDPOINTS.PACKAGE_BOOKING.CREATE, bookingData);

      if (response.data) {
      sessionStorage.removeItem("selectedPackage");
      // ✅ Pass state to indicate "package" tab should be active
      navigate("/my-bookings", { state: { activeTab: "package" } });
    }

    } catch (err) {
      console.error("Booking Error:", err);
      setMessage("⚠️ Booking failed. Try again.");
    }
  };

  return (
    <div className="package-booking-page">
      <div className="booking-container">
        <h1 className="title">Book Your Trip Package</h1>

        <div className="summary-card">
          <h3>Package Summary</h3>
          <div className="summary-grid">
            <p><strong>Destination :</strong> {pkg.place}</p>
            <p><strong>Duration :</strong> {pkg.days}</p>
            <p><strong>Hotel :</strong> {pkg.hotel}</p>
            <p><strong>Travel Bus :</strong> {pkg.bus}</p>
            <p><strong>Total Amount :</strong> ₹{pkg.price}</p>
            <p><strong>Wallet Balance :</strong> ₹{walletBalance}</p>
          </div>
        </div>

        {message && (
          <div className={`msg-box ${message.startsWith("⚠️") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <form className="booking-form" onSubmit={handleSubmit}>
          <h3>Traveler Details</h3>

          <div className="input-grid">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <h3>Payment Method</h3>

          <div className="payment-box">
            {["Credit Card", "Debit Card", "UPI", "Net Banking"].map((method) => (
              <label key={method} className={`payment-option ${formData.paymentMethod === method ? "active" : ""}`}>
                <input type="radio" name="paymentMethod" value={method} onChange={handleChange} />
                {method}
              </label>
            ))}

            <label
              className={`payment-option wallet-option ${
                walletBalance < totalAmount ? "disabled" : ""
              } ${formData.paymentMethod === "Wallet" ? "active" : ""}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="Wallet"
                disabled={walletBalance < totalAmount}
                onChange={handleChange}
              />
              Wallet (₹{walletBalance})
            </label>
          </div>

          <button className="confirm-btn" type="submit">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default PackageBooking;
