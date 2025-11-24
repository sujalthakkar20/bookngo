import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { API_ENDPOINTS } from "../config/api";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!location.state?.bookingId) return navigate("/");
      try {
        const res = await API.get(`/bookings/${location.state.bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };
    fetchBooking();
  }, [location.state, navigate]);

  if (!booking) return <div>Loading payment...</div>;

  return (
    <div>
      <h2>Payment Page</h2>
      <p>Pay ₹{booking.totalPrice} for booking of {booking.seatsBooked} seats</p>
      <button onClick={() => navigate("/my-bookings")}>Confirm Payment</button>
    </div>
  );
};

export default Payment;
