// FlexiTicket.jsx
import React from "react";
import "./FeaturePage.css";
import { useNavigate } from "react-router-dom";

const FlexiTicket = () => {
  const navigate = useNavigate();

  return (
    <div className="feature-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="feature-header purple">
        <h1>FlexiTicket</h1>
        <p>Change or cancel your trip anytime without extra charges.</p>
      </div>

      <div className="feature-content">
        <h2>What is FlexiTicket?</h2>
        <p>
          <strong>FlexiTicket</strong> gives travelers the power to reschedule or cancel 
          tickets with complete flexibility. Modify your journey dates or routes 
          without losing money or paying penalties.
        </p>

        <h2>Key Benefits</h2>
        <ul>
          <li>🔁 Change travel date up to 3 hours before departure.</li>
          <li>💸 Zero rescheduling fee on selected operators.</li>
          <li>📱 Easy date change from “My Bookings”.</li>
          <li>⚡ Instant confirmation of updated tickets.</li>
        </ul>

        <h2>Perfect for Frequent Travelers</h2>
        <p>
          Whether you’re on a business trip or a spontaneous getaway, FlexiTicket 
          ensures you stay in control of your plans — no stress, no losses.
        </p>

        <h2>How It Works</h2>
        <ol>
          <li>Book a ticket marked with <strong>FlexiTicket</strong>.</li>
          <li>Open “My Bookings” anytime before departure.</li>
          <li>Select <em>Change Date</em> or <em>Cancel</em>.</li>
          <li>Receive your updated e-ticket instantly.</li>
        </ol>

        <h2>Terms</h2>
        <ul>
          <li>Available only for participating operators.</li>
          <li>Changes allowed once per ticket.</li>
          <li>Refunds follow standard Free Cancellation rules.</li>
        </ul>

        <div className="feature-highlight purple-bg">
          <h3>Travel flexible — your plans can change, and so can your ticket.</h3>
        </div>
      </div>
    </div>
  );
};

export default FlexiTicket;
