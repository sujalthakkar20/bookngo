import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../pages/WalletContext";
import API from "../utils/api";
import { API_ENDPOINTS } from "../config/api";
import "./Booking.css";

const Booking = () => {
  const navigate = useNavigate();
  const { walletBalance, deductFromWallet } = useWallet();

  const [bus, setBus] = useState(null);
  const [searchBus, setSearchBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    paymentMethod: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedSearchBus = JSON.parse(sessionStorage.getItem("selectedBus") || "null");
    const storedSeats = JSON.parse(sessionStorage.getItem("selectedSeats") || "[]");

    if (!storedSearchBus || storedSeats.length === 0) {
      navigate("/");
      return;
    }

    setSearchBus(storedSearchBus);
    setSelectedSeats(storedSeats);

    const fetchBus = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.BUSES.GET_BY_ID(storedSearchBus.bus._id));
        setBus(res.data);
      } catch (err) {
        console.error("Error fetching bus:", err);
        setMessage("Failed to fetch bus details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBus();
  }, [navigate]);

  const totalAmount = searchBus?.searchSegment
    ? searchBus.searchSegment.segmentPrice * selectedSeats.length
    : searchBus?.bus.price * selectedSeats.length;

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

    if (formData.paymentMethod === "Wallet") {
      if (walletBalance < totalAmount) {
        setMessage("⚠️ Insufficient wallet balance.");
        return;
      }
      deductFromWallet(totalAmount);
    }

    try {
      // ⭐ Use segment info if available
      const segment = searchBus.searchSegment || {
        from: searchBus.bus.from,
        to: searchBus.bus.to,
        departureTime: searchBus.bus.departureTime,
        arrivalTime: searchBus.bus.arrivalTime,
        segmentPrice: searchBus.bus.price,
      };

      const bookingData = {
        busId: searchBus.bus._id,
        seats: selectedSeats,
        travelDate: searchBus.bus.date,
        contactName: formData.name,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        paymentMethod: formData.paymentMethod,
        fromStation: segment.from,
        toStation: segment.to,
        segmentDeparture: segment.departureTime,
        segmentArrival: segment.arrivalTime,
        segmentPrice: segment.segmentPrice,
      };

      await API.post(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);

      sessionStorage.removeItem("selectedBus");
      sessionStorage.removeItem("selectedSeats");

      navigate("/my-bookings");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create booking.");
    }
  };

  if (loading) return <div className="booking-page">Loading booking details...</div>;
  if (!searchBus || !bus) return <div>No booking data found</div>;

  const route = searchBus.searchSegment || {
    from: bus.from,
    to: bus.to,
    departureTime: bus.departureTime,
    arrivalTime: bus.arrivalTime,
    segmentPrice: bus.price,
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1 className="title">Complete Your Booking</h1>

        <div className="summary-card">
          <h3>Journey Summary</h3>
          <div className="summary-grid">
            <p><strong>Bus :</strong> {bus.busName} ({bus.busNumber})</p>
            <p><strong>Booking For :</strong> {route.from} → {route.to}</p>
            <p><strong>Date :</strong> {new Date(bus.date).toLocaleDateString()}</p>
            <p><strong>Departure :</strong> {route.departureTime}</p>
            <p><strong>Arrival :</strong> {route.arrivalTime}</p>
            <p><strong>Seats :</strong> {selectedSeats.join(", ")}</p>
            <p><strong>Total Amount :</strong> ₹{totalAmount}</p>
            <p><strong>Wallet Balance :</strong> ₹{walletBalance}</p>
          </div>
        </div>

        {message && (
          <div className={`msg-box ${message.startsWith("⚠️") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        <form className="booking-form" onSubmit={handleSubmit}>
          <h3>Passenger Details</h3>
          <div className="input-grid">
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" placeholder="Enter mobile number" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <h3>Payment Method</h3>
          <div className="payment-box">
            {["Credit Card", "Debit Card", "UPI", "Net Banking"].map((method) => (
              <label key={method} className={`payment-option ${formData.paymentMethod === method ? "active" : ""}`}>
                <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleChange} />
                {method}
              </label>
            ))}

            <label className={`payment-option wallet-option ${walletBalance < totalAmount ? "disabled" : ""} ${formData.paymentMethod === "Wallet" ? "active" : ""}`}>
              <input type="radio" name="paymentMethod" value="Wallet" disabled={walletBalance < totalAmount} checked={formData.paymentMethod === "Wallet"} onChange={handleChange} />
              Wallet (₹{walletBalance})
            </label>
          </div>

          <button className="confirm-btn" type="submit">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
