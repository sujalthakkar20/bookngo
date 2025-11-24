// BusTimetable.jsx
import React from "react";
import "./FeaturePage.css";
import { useNavigate } from "react-router-dom";

const BusTimetable = () => {
  const navigate = useNavigate();

  return (
    <div className="feature-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="feature-header blue">
        <h1>Introducing Bus Timetable</h1>
        <p>Check real-time schedules and routes for your next journey.</p>
      </div>

      <div className="feature-content">
        <h2>What is Bus Timetable?</h2>
        <p>
          The <strong>Bus Timetable</strong> feature helps you plan your trip better by 
          showing accurate departure and arrival times for buses between cities 
          across India. No more confusion or last-minute delays — everything is visible 
          before you book.
        </p>

        <h2>Features</h2>
        <ul>
          <li>🕒 Real-time schedules with live updates from operators.</li>
          <li>🚏 City-to-city and state-level timetable support.</li>
          <li>📍 Interactive route map and stop details.</li>
          <li>📅 Daily, weekly, and festival-season timetables.</li>
        </ul>

        <h2>How It Helps You</h2>
        <p>
          Whether you travel frequently or occasionally, Bus Timetable keeps you 
          informed about bus availability, duration, and next departures — 
          saving you time and stress at the bus station.
        </p>

        <h2>How to Use</h2>
        <ol>
          <li>Visit the <strong>Bus Timetable</strong> section in the app or website.</li>
          <li>Enter your <em>from</em> and <em>to</em> destinations.</li>
          <li>View all available bus timings instantly.</li>
          <li>Tap on any route to book directly.</li>
        </ol>

        <div className="feature-highlight blue-bg">
          <h3>Plan smarter. Travel smoother. Stay on time with BookNGo Bus Timetable.</h3>
        </div>
      </div>
    </div>
  );
};

export default BusTimetable;
