import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { API_ENDPOINTS } from "../config/api";
import "./SeatSelection.css";

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedBusData = JSON.parse(sessionStorage.getItem("selectedBus"));

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.BUSES.GET_BY_ID(id));
        setBus(res.data);

        // Demo booked seats (replace with actual backend data if available)
        const randomBooked = [3, 7, 18, 25, 36, 39];
        setBookedSeats(randomBooked);
      } catch (err) {
        console.error("Error fetching bus:", err);
        setError("Failed to fetch bus details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBus();
  }, [id]);

  const handleSeatClick = (seatNum) => {
    if (bookedSeats.includes(seatNum)) return;

    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNum));
    } else {
      setSelectedSeats([...selectedSeats, seatNum]);
    }
  };

  const handleProceed = () => {
    if (!selectedSeats.length) {
      alert("Please select at least one seat!");
      return;
    }

    // Determine segment info
    const segment = selectedBusData?.searchSegment || {
      from: bus.from,
      to: bus.to,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      segmentPrice: bus.price,
    };

    // Save selected bus + segment + seats
    sessionStorage.setItem(
      "selectedBus",
      JSON.stringify({
        bus,
        searchSegment: segment,
      })
    );
    sessionStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));

    navigate("/booking");
  };

  if (loading) return <div>Loading seat map...</div>;
  if (error) return <div>{error}</div>;
  if (!bus) return <div>No bus found</div>;

  const seatNumbers = Array.from({ length: bus.totalSeats }, (_, i) => i + 1);
  const emergencySeats = seatNumbers.slice(-4);

  const routeFrom = selectedBusData?.searchSegment?.from || bus.from;
  const routeTo = selectedBusData?.searchSegment?.to || bus.to;
  const depTime = selectedBusData?.searchSegment?.departureTime || bus.departureTime;
  const arrTime = selectedBusData?.searchSegment?.arrivalTime || bus.arrivalTime;

  return (
    <div className="seat-selection-page">
      <h2>
        {bus.busName} ({bus.busNumber})
      </h2>
      <p>
        {routeFrom} → {routeTo} {" | "}
        {new Date(bus.date).toLocaleDateString()}
      </p>
      <p className="time-info">
        <strong>Departure:</strong> {depTime} &nbsp;&nbsp;
        <strong>Arrival:</strong> {arrTime}
      </p>

      <div className="seat-layout-container">
        <div className="driver-section">
          <div className="front-label">FRONT DOOR</div>
          <div className="driver-area">🪑 Driver</div>
          <div className="tv">📺 TV</div>
        </div>

        <div className="seat-map">
          {seatNumbers.map((num) => (
            <button
              key={num}
              className={`seat 
                ${bookedSeats.includes(num) ? "booked" : ""} 
                ${selectedSeats.includes(num) ? "selected" : ""} 
                ${!bookedSeats.includes(num) ? "available" : ""} 
                ${emergencySeats.includes(num) ? "emergency" : ""}`}
              onClick={() => handleSeatClick(num)}
              disabled={bookedSeats.includes(num)}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="exit-section">
          <div className="exit-label">🚨 Emergency Exit</div>
        </div>
      </div>

      <div className="seat-legend">
        <div><span className="legend-box available"></span> Available</div>
        <div><span className="legend-box selected"></span> Selected</div>
        <div><span className="legend-box booked"></span> Booked</div>
        <div><span className="legend-box emergency"></span> Emergency Exit</div>
      </div>

      <button className="proceed-btn" onClick={handleProceed}>
        Proceed to Booking
      </button>
    </div>
  );
};

export default SeatSelection;
