import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PackageDetails.css";

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read selected package from session storage
    const storedPackage = JSON.parse(sessionStorage.getItem("selectedPackage"));

    // If refreshed without data OR id mismatched → go to packages page
    if (!storedPackage || storedPackage.id !== Number(id)) {
      navigate("/packages");
      return;
    }

    setPackageData(storedPackage);
    setLoading(false);
  }, [id, navigate]);

  if (loading) return <div className="package-details-page">Loading...</div>;
  if (!packageData) return <div className="package-details-page">Package not found</div>;

  const p = packageData;

  return (
    <div className="package-details-page">
      <div className="details-container">

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="image-box">
          <img src={p.image} alt={p.place} className="details-image" />
        </div>

        <h1 className="place-title">{p.place}</h1>
        <h3 className="days-info">{p.days}</h3>

        {/* Description */}
        {p.description && (
          <div className="section">
            <h2>About Trip</h2>
            <p>{p.description}</p>
          </div>
        )}

        {/* Hotel Details */}
        <div className="section">
          <h2>Hotel Details</h2>
          <p><strong>Hotel Name:</strong> {p.hotel}</p>
          {p.hotelPrice && <p><strong>Hotel Price:</strong> ₹{p.hotelPrice}/night</p>}
        </div>

        {/* Travel Details */}
        <div className="section">
          <h2>Travel Details</h2>
          <p><strong>Bus Type:</strong> {p.bus}</p>
          {p.pickupPoint && <p><strong>Pickup Point:</strong> {p.pickupPoint}</p>}
          {p.travelDate && (
            <p><strong>Travel Date:</strong> {new Date(p.travelDate).toLocaleDateString()}</p>
          )}
        </div>

        {/* Itinerary */}
        {p.itinerary?.length > 0 && (
          <div className="section">
            <h2>Trip Itinerary</h2>
            <ul>
              {p.itinerary.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Facilities */}
        <div className="section">
          <h2>Facilities Included</h2>
          <ul className="facility-list">
            {(p.facility || []).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        {/* Price Section */}
        <div className="section price-section">
          <h2>Total Price</h2>
          <h1 className="price">₹{p.price}</h1>
        </div>

        {/* Proceed Button */}
        <button
          className="book-btn"
          onClick={() => {
            sessionStorage.setItem("selectedPackage", JSON.stringify(p));
            navigate(`/packages/booking/${p.id}`);
          }}
        >
          Continue to Booking
        </button>

      </div>
    </div>
  );
};

export default PackageDetails;
