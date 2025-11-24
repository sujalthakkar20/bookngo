// AssuranceProgram.jsx
import React from "react";
import "./FeaturePage.css";
import { useNavigate } from "react-router-dom";

const AssuranceProgram = () => {
  const navigate = useNavigate();

  return (
    <div className="feature-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="feature-header yellow">
        <h1>Assurance Program</h1>
        <p>Travel safely with insurance coverage for cancellations and delays.</p>
      </div>

      <div className="feature-content">
        <h2>What is the Assurance Program?</h2>
        <p>
          The <strong>Assurance Program</strong> is a premium protection plan for 
          BookNGo travelers. It safeguards your journey against unforeseen 
          cancellations, delays, and accidents — giving you total peace of mind.
        </p>

        <h2>Coverage Includes</h2>
        <ul>
          <li>🚌 Trip cancellation or delay reimbursement.</li>
          <li>💰 Compensation for lost luggage or missed connections.</li>
          <li>🧾 Medical support for travel-related emergencies.</li>
          <li>📱 24×7 customer assistance during travel.</li>
        </ul>

        <h2>Benefits</h2>
        <p>
          For a small additional fee, travelers get guaranteed support and 
          financial protection — ensuring that every trip is safe, secure, and stress-free.
        </p>

        <h2>How to Enroll</h2>
        <ol>
          <li>Select “Add Assurance Program” at checkout.</li>
          <li>Get your coverage confirmation with your e-ticket.</li>
          <li>Enjoy priority support if your journey is disrupted.</li>
        </ol>

        <h2>Terms & Notes</h2>
        <ul>
          <li>Valid for one journey per booking.</li>
          <li>Claims must be made within 7 days of travel date.</li>
          <li>Coverage subject to operator and route eligibility.</li>
        </ul>

        <div className="feature-highlight yellow-bg">
          <h3>Peace of mind for every mile. Choose the Assurance Program today.</h3>
        </div>
      </div>
    </div>
  );
};

export default AssuranceProgram;
