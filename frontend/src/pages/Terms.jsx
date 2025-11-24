import React from "react";
import "./PageStyle.css";

const Terms = () => (
  <div className="terms-page-bg">
    <div className="terms-overlay">
      <div className="terms-page">
        <header className="terms-header">
          <h1>Terms of Service</h1>
          <p>
            Please read these terms carefully before using <strong>BookNGo</strong>. 
            By accessing or using our platform, you agree to these conditions.
          </p>
        </header>

        <section className="terms-content">
          <h2>BUS</h2>

          <h3>Role of BookNGo</h3>
          <p>
            BookNGo provides a digital platform connecting travelers with bus operators. 
            We do not operate or manage buses directly. Routes, fares, and schedules 
            are determined by bus operators.
          </p>

          <h3>Limitation of Liability</h3>
          <p>
            BookNGo is not liable for delays, cancellations, or service quality issues. 
            We act solely as a booking intermediary between users and operators.
          </p>

          <h3>User Responsibilities</h3>
          <ul>
            <li>Carry a valid government-issued ID and booking confirmation.</li>
            <li>Arrive at the boarding point at least 30 minutes before departure.</li>
            <li>Tickets issued are non-transferable.</li>
            <li>Verify all trip details before traveling.</li>
          </ul>

          <h3>Cancellation of Ticket</h3>
          <p>
            Cancellations can be made through your BookNGo account or via customer 
            support. Refunds will follow operator-specific policies.
          </p>

          <h3>Rescheduling of Ticket</h3>
          <p>
            Rescheduling is available based on the operator’s policy and seat 
            availability. Additional charges or fare differences may apply.
          </p>

          <h2>RYDE</h2>

          <h3>Role of BookNGo</h3>
          <p>
            BookNGo connects users with verified vehicle operators for private 
            rentals and rides. We do not own or operate vehicles directly.
          </p>

          <h3>Payments</h3>
          <p>
            Users may pay partially or fully through BookNGo, depending on the 
            booking type. Additional charges such as tolls or parking fees are 
            paid directly to the operator.
          </p>

          <h3>Disputes</h3>
          <p>
            Any disputes must be reported to BookNGo within 48 hours of travel 
            completion. Our support team will mediate between the user and 
            operator to reach a fair resolution.
          </p>
        </section>
      </div>
    </div>
  </div>
);

export default Terms;
