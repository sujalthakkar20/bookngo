import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import { API_ENDPOINTS } from "../config/api";
import "./MyBookings.css";

const MyBookings = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [busBookings, setBusBookings] = useState([]);
  const [packageBookings, setPackageBookings] = useState([]);

  const [activeTab, setActiveTab] = useState("bus");

  // ⭐ Fetch BUS bookings
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchBusBookings = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.BOOKINGS.GET_BY_USER);
        setBusBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bus bookings:", err);
      }
    };

    fetchBusBookings();
  }, [isAuthenticated]);

  // ⭐ Fetch PACKAGE bookings
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPackageBookings = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.PACKAGE_BOOKING.GET_BY_USER);
        setPackageBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch package bookings:", err);
      }
    };

    fetchPackageBookings();
  }, [isAuthenticated]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const viewTicket = (id) => navigate(`/ticket/${id}`);

  /* ============================================================
      ⭐ CANCEL FUNCTIONS
  ============================================================ */

  // Cancel Bus Booking
  const cancelBusBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
        await API.put(API_ENDPOINTS.BOOKINGS.CANCEL(id));

      // Update only the cancelled booking
      setBusBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "Cancelled", isCancelled: true } : b
        )
      );
    } catch (err) {
      console.error("Cancel Error:", err);
      alert("Failed to cancel booking.");
    }
  };

  // Cancel Package Booking
  const cancelPackageBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this package trip?"))
      return;

    try {
       await API.put(API_ENDPOINTS.PACKAGE_BOOKING.CANCEL(id));
      setPackageBookings((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: "Cancelled", isCancelled: true } : p
        )
      );
    } catch (err) {
      console.error("Cancel Error:", err);
      alert("Failed to cancel package booking.");
    }
  };

  /* ============================================================
      ⭐ CAN CANCEL LOGIC FOR BUS
  ============================================================ */
  const canCancelBus = (travelDate, departureTime) => {
    if (!travelDate || !departureTime) return false;

    const now = new Date();
    const trip = new Date(travelDate);

    const [h, m] = departureTime.split(":");
    trip.setHours(h);
    trip.setMinutes(m);

    return now < trip; // allow cancel
  };

  /* ============================================================
      ⭐ CAN CANCEL LOGIC FOR PACKAGE
  ============================================================ */
  const canCancelPackage = (travelDate) => {
    const now = new Date();
    const trip = new Date(travelDate);
    return now < trip;
  };

  return (
    <div className="my-bookings-page">
      <div className="bookings-container">
        <h2 className="page-title">My Bookings</h2>

        {/* Toggle */}
        <div className="booking-toggle">
          <button
            className={activeTab === "bus" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setActiveTab("bus")}
          >
            Bus Bookings
          </button>

          <button
            className={
              activeTab === "package" ? "toggle-btn active" : "toggle-btn"
            }
            onClick={() => setActiveTab("package")}
          >
            Package Bookings
          </button>
        </div>

        {/* ============================================================
            ⭐ BUS BOOKINGS
        ============================================================ */}
        {activeTab === "bus" && (
          <>
            {busBookings.length === 0 ? (
              <div className="no-bookings">
                <h3>No Bus Bookings Found</h3>
                <p>You haven't made any bus bookings yet.</p>
                <button className="book-now-btn" onClick={() => navigate("/")}>
                  Book a Bus
                </button>
              </div>
            ) : (
              <div className="bookings-list">
                {busBookings.map((b) => {
                  const from = b.fromStation || b.bus?.from || "—";
                  const to = b.toStation || b.bus?.to || "—";

                  const departure =
                    b.segmentDeparture || b.bus?.departureTime || "—";
                  const arrival =
                    b.segmentArrival || b.bus?.arrivalTime || "—";

                  const perSeatPrice = b.segmentPrice ?? b.bus?.price ?? 0;
                  const totalPrice =
                    b.totalPrice ??
                    perSeatPrice * (b.seatsBooked?.length || 0);

                  return (
                    <div
                      key={b._id}
                      className={`booking-card ${
                        b.isCancelled ? "cancelled" : ""
                      }`}
                    >
                      <div className="booking-header">
                        <div>
                          <h3>{b.busName}</h3>
                          <p className="nroute">
                            {from} → {to}
                          </p>
                        </div>

                        <span
                          className={`status ${
                            b.isCancelled ? "cancelled" : "confirmed"
                          }`}
                        >
                          {b.isCancelled ? "Cancelled" : "Confirmed"}
                        </span>
                      </div>

                      <div className="booking-details">
                        <div className="detail-item">
                          <span className="label">Travel Date :</span>
                          <span>
                            {new Date(b.travelDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="detail-item">
                          <span className="label">Departure :</span>
                          <span>{departure}</span>
                        </div>

                        <div className="detail-item">
                          <span className="label">Arrival :</span>
                          <span>{arrival}</span>
                        </div>

                        <div className="detail-item">
                          <span className="label">Seats :</span>
                          <span>{b.seatsBooked?.join(", ")}</span>
                        </div>

                        <div className="detail-item">
                          <span className="label">Amount Paid :</span>
                          <span className="amount">₹{totalPrice}</span>
                        </div>
                      </div>

                      <div className="booking-actions">
                        <button
                          className="action-btn view-ticket"
                          onClick={() => viewTicket(b._id)}
                          disabled={b.isCancelled}
                        >
                          View Ticket
                        </button>

                        {!b.isCancelled &&
                          canCancelBus(b.travelDate, departure) && (
                            <button
                              className="action-btn cancel-btn"
                              onClick={() => cancelBusBooking(b._id)}
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ============================================================
            ⭐ PACKAGE BOOKINGS
        ============================================================ */}
        {activeTab === "package" && (
          <>
            {packageBookings.length === 0 ? (
              <div className="no-bookings">
                <h3>No Package Bookings Found</h3>
                <p>You haven't booked any trip packages yet.</p>
                <button
                  className="book-now-btn"
                  onClick={() => navigate("/packages")}
                >
                  View Packages
                </button>
              </div>
            ) : (
              <div className="bookings-list">
                {packageBookings.map((p) => (
                  <div
                    key={p._id}
                    className={`booking-card ${
                      p.isCancelled ? "cancelled" : ""
                    }`}
                  >
                    <div className="package-img-box">
                      <img src={p.image} alt={p.place} className="package-img" />
                    </div>

                    <div className="booking-header">
                      <div>
                        <h3>{p.place}</h3>
                        <p className="nroute">{p.days}</p>
                      </div>

                      <span
                        className={`status ${
                          p.isCancelled ? "cancelled" : "confirmed"
                        }`}
                      >
                        {p.isCancelled ? "Cancelled" : "Confirmed"}
                      </span>
                    </div>

                    <div className="booking-details">
                      {/* <div className="detail-item">
                        <span className="label">Hotel :</span>
                        <span>{p.hotel}</span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Travel Bus :</span>
                        <span>{p.busType}</span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Facilities :</span>
                        <span>{p.facilities?.join(", ")}</span>
                      </div> */}

                      <div className="detail-item">
                        <span className="label">Amount Paid :</span>
                        <span className="amount">₹{p.price}</span>
                      </div>

                      <div className="detail-item">
                        <span className="label">Payment Method :</span>
                        <span>{p.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <button
                        className="action-btn view-ticket"
                        onClick={() => navigate(`/package-ticket/${p._id}`)}
                        disabled={p.isCancelled}
                      >
                        View Package Ticket
                      </button>

                      {!p.isCancelled && canCancelPackage(p.travelDate) && (
                        <button
                          className="action-btn cancel-btn"
                          onClick={() => cancelPackageBooking(p._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
