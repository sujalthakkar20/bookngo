import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { API_ENDPOINTS } from "../config/api";
import { jsPDF } from "jspdf";
import "./PackageTicket.css";

const PackageTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pack, setPack] = useState(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await API.get(API_ENDPOINTS.PACKAGE_BOOKING.GET_BY_ID(id));
        setPack(res.data);
      } catch (err) {
        console.error("Failed to load package ticket:", err);
      }
    };
    fetchPackage();
  }, [id]);

  const generateTicketID = () => pack?._id ? "PKG-" + pack._id.slice(-6).toUpperCase() : "PKG-XXXXXX";

  const downloadPDF = () => {
    if (!pack) return;
    const doc = new jsPDF();
    const ticketID = generateTicketID();
    doc.setFontSize(20);
    doc.text("Holiday Package Ticket", 14, 15);
    doc.setFontSize(12);
    doc.text(`Ticket ID: ${ticketID}`, 14, 25);
    doc.text(`Place: ${pack.place}`, 14, 35);
    doc.text(`Days: ${pack.days}`, 14, 45);
    doc.text(`Hotel: ${pack.hotel}`, 14, 55);
    doc.text(`Room Type: ${pack.roomType}`, 14, 65);
    doc.text(`Bus Type: ${pack.busType}`, 14, 75);
    doc.text(`Travel Date: ${new Date(pack.travelDate).toLocaleDateString()}`, 14, 85);
    doc.text(`Pickup Point: ${pack.pickupPoint}`, 14, 95);
    doc.text(`Total Price: ₹${pack.price}`, 14, 105);
    doc.text(`Payment Method: ${pack.paymentMethod}`, 14, 115);
    doc.text("Facilities Included:", 14, 130);
    pack.facilities.forEach((f, i) => doc.text(`- ${f}`, 20, 140 + i * 8));
    doc.save(`${ticketID}.pdf`);
  };

  if (!pack) return <div className="loading">Loading Ticket...</div>;

  const ticketID = generateTicketID();

  return (
    <div className="package-ticket-page">
      <div className="ticket-header">
        <button className="nback-btn" onClick={() => navigate("/my-bookings")}>← Back</button>
        <h2 className="ticket-logo">Package Ticket</h2>
      </div>

      <div className="ticket-card">

        <div className="ticket-top">
          <div>
            <h2 className="place-name">{pack.place}</h2>
            <p className="trip-days">{pack.days}</p>
          </div>
          <span className="ticket-id">{ticketID}</span>
        </div>

        <span className="status-tag">Confirmed</span>

        {/* RECTANGLE LAYOUT */}
        <div className="ticket-details-rectangle">

          <div className="ticket-column">
            <h4 className="section-title">Hotel</h4>
            <p><strong>Hotel :</strong> {pack.hotel}</p>
            <p><strong>Room Type :</strong> {pack.roomType}</p>

            <h4 className="section-title">Travel</h4>
            <p><strong>Bus Type :</strong> {pack.busType}</p>
            <p><strong>Travel Date :</strong> {new Date(pack.travelDate).toLocaleDateString()}</p>
            <p><strong>Pickup :</strong> {pack.pickupPoint}</p>
          </div>

          <div className="ticket-column">
            <h4 className="section-title">Facilities</h4>
            <ul className="facility-list">
              {pack.facilities.map((f, i) => <li key={i}>{f}</li>)}
            </ul>

            <h4 className="section-title">Payment</h4>
            <p><strong>Total :</strong> ₹{pack.price}</p>
            <p><strong>Method :</strong> {pack.paymentMethod}</p>
          </div>

        </div>
      </div>

      <button className="download-ticket-btn" onClick={downloadPDF}>
        ⬇ Download Ticket (PDF)
      </button>
    </div>
  );
};

export default PackageTicket;
