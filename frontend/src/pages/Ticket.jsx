import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { jsPDF } from "jspdf";
import "./Ticket.css";

const Ticket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await API.get(`/bookings/${id}`);
        setBooking(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooking();
  }, [id]);

  const generateTicketID = () => {
    return booking?._id
      ? "TCK-" + booking._id.slice(-6).toUpperCase()
      : "TCK-XXXXXX";
  };

  const downloadPDF = () => {
    if (!booking) return;

    const doc = new jsPDF();
    const ticketID = generateTicketID();

    // Use segment info if exists, otherwise main route
    const from = booking.fromStation || booking.bus.from;
    const to = booking.toStation || booking.bus.to;
    const departure = booking.segmentDeparture || booking.bus.departureTime;
    const arrival = booking.segmentArrival || booking.bus.arrivalTime;

    const routeText = `${from} → ${to} (Dep: ${departure} | Arr: ${arrival})`;
    const wrappedRoute = doc.splitTextToSize(routeText, 180);

    doc.setFontSize(18);
    doc.text("Bus Ticket", 14, 15);

    doc.setFontSize(12);
    doc.text(`Ticket ID: ${ticketID}`, 14, 25);
    doc.text(`Bus Name: ${booking.bus.busName}`, 14, 35);
    doc.text(`Bus Number: ${booking.bus.busNumber}`, 14, 45);
    doc.text(`Route:`, 14, 55);
    doc.text(wrappedRoute, 14, 63);

    const nextY = 63 + wrappedRoute.length * 7;

    doc.text(`Date: ${new Date(booking.travelDate).toLocaleDateString()}`, 14, nextY + 10);
    doc.text(`Seats: ${Array.isArray(booking.seatsBooked) ? booking.seatsBooked.join(", ") : booking.seatsBooked}`, 14, nextY + 20);
    doc.text(`Total Amount: ₹${booking.totalPrice}`, 14, nextY + 30);
    doc.text(`Passenger: ${booking.user?.name || booking.contactName}`, 14, nextY + 45);
    doc.text(`Email: ${booking.user?.email || booking.contactEmail}`, 14, nextY + 55);

    doc.save(`${ticketID}.pdf`);
  };

  if (!booking) return <div className="loading">Loading Ticket...</div>;

  const ticketID = generateTicketID();
  const from = booking.fromStation || booking.bus.from;
  const to = booking.toStation || booking.bus.to;
  const departure = booking.segmentDeparture || booking.bus.departureTime;
  const arrival = booking.segmentArrival || booking.bus.arrivalTime;

  return (
    <div className="ticket-page">
      <div className="ticket-header">
        <button className="nback-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="ticket-logo">Your Ticket</h2>
      </div>

      <div className="ticket-card glass-card">
        <div className="ticket-top">
          <div>
            <h3 className="nbus-name">{booking.bus.busName}</h3>
            <p className="route">{from} → {to}</p>
            <p className="time-info">Departure : {departure} | Arrival : {arrival}</p>
          </div>

          <span className="ticket-id">{ticketID}</span>
        </div>

        <span className={`status-tag ${booking.status}`}>
          {booking.status || "confirmed"}
        </span>

        <div className="ticket-details">
          <p><strong>Date :</strong> {new Date(booking.travelDate).toLocaleDateString()}</p>
          <p><strong>Seat No :</strong> {Array.isArray(booking.seatsBooked) ? booking.seatsBooked.join(", ") : booking.seatsBooked}</p>
          <p><strong>Total Amount :</strong> ₹{booking.totalPrice}</p>

          <h4 className="section-title">Passenger Details</h4>
          <p><strong>Name :</strong> {booking.user?.name || booking.contactName}</p>
          <p><strong>Email :</strong> {booking.user?.email || booking.contactEmail}</p>
        </div>
      </div>

      <button className="bus-download-ticket-btn" onClick={downloadPDF}>
        ⬇ Download Ticket (PDF)
      </button>
    </div>
  );
};

export default Ticket;
