// FreeCancellation.jsx
import React from "react";
import "./FeaturePage.css"; // shared style for all feature pages
import { useNavigate } from "react-router-dom";

const FreeCancellation = () => {
  const navigate = useNavigate();

  return (
    <div className="feature-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="feature-header green">
        <h1>Free Cancellation</h1>
        <p>Cancel anytime and get a 100% refund instantly!</p>
      </div>

      <div className="feature-content">
        <h2>About the Program</h2>
        <p>
          Life is unpredictable — plans can change at the last minute. That’s why
          <strong> BookNGo </strong> introduces the <strong>Free Cancellation</strong> feature,
          allowing travelers to cancel their tickets with no penalties or hidden fees.
          Whether it’s a change in schedule, weather, or an emergency, your money stays safe.
        </p>

        <h2>How It Works</h2>
        <ul>
          <li>✅ Available on all major routes and trusted operators.</li>
          <li>💳 Get 100% refund instantly to your original payment method.</li>
          <li>🕒 Cancel up to <strong>6 hours before departure</strong> to receive full refund.</li>
          <li>📩 Instant confirmation via SMS and email upon cancellation.</li>
        </ul>

        <h2>Why You’ll Love It</h2>
        <p>
          We know flexibility is key to travel. With <strong>Free Cancellation</strong>, 
          you can book your tickets early without the fear of losing money. 
          It’s perfect for students, professionals, and families whose plans 
          often depend on last-minute changes.
        </p>

        <h2>Example Scenario</h2>
        <p>
          Imagine you’ve booked a bus from <strong>Delhi to Jaipur</strong> for 10:00 AM.
          At 3:00 AM, an urgent meeting forces you to cancel your trip. 
          With Free Cancellation, you’ll receive your entire payment back — no hidden 
          fees, no waiting, no questions asked. It’s fast, fair, and reliable.
        </p>

        <h2>How to Use</h2>
        <ol>
          <li>Open the <strong>BookNGo</strong> app or website.</li>
          <li>Go to <em>My Bookings</em>.</li>
          <li>Select your journey and click on <strong>Cancel Ticket</strong>.</li>
          <li>Confirm the action — your refund starts processing instantly!</li>
        </ol>

        <h2>Terms and Conditions</h2>
        <ul>
          <li>Applicable only to online bookings made through BookNGo.</li>
          <li>Cancellation must be done within the eligible time window.</li>
          <li>Refund processing time may vary slightly by bank.</li>
          <li>Feature valid only for participating operators.</li>
        </ul>

        <div className="feature-highlight green-bg">
          <h3>
            Travel confidently — your plans may change, but your money stays safe
            with BookNGo Free Cancellation.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default FreeCancellation;
