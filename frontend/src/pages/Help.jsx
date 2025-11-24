import React from "react";
import "./Help.css";
import { FaBus, FaTrain, FaHotel, FaPlane, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-header">
        <h2>We’re Here to Help!</h2>
        <p>Reach out to BookNGo for any travel or booking-related support.</p>
      </div>

      <div className="contact-grid">
        {/* Bus */}
        <div className="contact-card">
          <FaBus className="contact-icon" />
          <h3>Bus</h3>
          <p>
            Support:{" "}
            <a href="#" className="support-link">
              Click Here
            </a>
          </p>
        </div>

        


        {/* Office Address */}
        <div className="contact-card address-card">
          <FaMapMarkerAlt className="contact-icon" />
          <h3>Office Address</h3>
          <p>
            301-304, Laxmi Enclave– 2,
            <br />
            Gajera Circle, Katargam,
            <br />
            Surat, Gujarat – 395004, India
            <br />
            <br />
            Phone:{" "}
            <a href="tel:+9191705 72073" className="support-link">
              +91-91705 72073
            </a>
            <br />
            Email:{" "}
            <a href="mailto:support@bookngo.com" className="support-link">
              support@bookngo.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
