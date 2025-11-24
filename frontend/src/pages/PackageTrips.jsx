import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PackageTrips.css";

const PackageTrips = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const tripPackages = [
    {
      id: 1,
      place: "Goa",
      days: "4 Days / 3 Nights",
      price: 8999,
      image: "https://plus.unsplash.com/premium_photo-1697730411634-5313371ad8fe?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmFnYSUyMGJlYWNofGVufDB8fDB8fHww",
      hotel: "Sea Breeze Resort",
      hotelPrice: 3500,
      bus: "AC Sleeper Bus - Round Trip",
      facility: ["Breakfast", "Beach Visit", "Boat Cruise", "Local Sightseeing"],
      description: "Enjoy beaches, nightlife, cruises and water sports."
    },
    {
      id: 2,
      place: "Mahabaleshwar",
      days: "3 Days / 2 Nights",
      price: 6999,
      image: "https://t3.ftcdn.net/jpg/04/39/09/18/360_F_439091872_aMTH8H18liErIdbvyqzFwGLn6zeTkumB.jpg",
      hotel: "Evergreen Hill Resort",
      hotelPrice: 2800,
      bus: "AC Semi-Sleeper Bus - Round Trip",
      facility: ["Breakfast & Dinner", "Mapro Garden", "Elephant Point Visit"],
      description: "Perfect hill station for nature lovers & fresh climate."
    },
    {
      id: 3,
      place: "Manali",
      days: "5 Days / 4 Nights",
      price: 12999,
      image: "https://t4.ftcdn.net/jpg/02/57/91/21/360_F_257912197_ySuBhefKYPQIZNa3xeGiObLpgYBnH9U5.jpg",
      hotel: "Snow View Resort",
      hotelPrice: 4200,
      bus: "Luxury Volvo AC Bus - Round Trip",
      facility: ["Breakfast", "Solang Valley", "Snow Activities", "Mall Road Visit"],
      description: "A snowy paradise with adventure activities and mountain views."
    },
    {
      id: 4,
      place: "Ooty",
      days: "3 Days / 2 Nights",
      price: 7499,
      image: "data:image/jpeg;base64,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",
      hotel: "Blue Mountain Cottage",
      hotelPrice: 3000,
      bus: "AC Sleeper Bus - Round Trip",
      facility: ["Botanical Garden", "Tea Factory Tour", "Ooty Lake Boating"],
      description: "Cool climate, beautiful lakes, gardens & peaceful nature."
    }
  ];

const handleSelect = (pkg) => {
  setSelected(pkg.id);

  // save package for details and booking page
  sessionStorage.setItem("selectedPackage", JSON.stringify(pkg));

  navigate(`/packages/${pkg.id}`);
};


  return (
    <div className="trip-container">
      <h2 className="trip-title">Popular Holiday Packages</h2>

      <div className="trip-grid">
        {tripPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`trip-card ${selected === pkg.id ? "selected" : ""}`}
            onClick={() => handleSelect(pkg)}
          >
            <img src={pkg.image} alt={pkg.place} className="trip-image" />

            <div className="trip-content">
              <h3 className="trip-place">{pkg.place}</h3>
              <p className="trip-days">{pkg.days}</p>

              <p className="trip-desc">{pkg.description}</p>

              <h4 className="sub-heading">Hotel</h4>
              <p className="trip-hotel">
                {pkg.hotel} – ₹{pkg.hotelPrice}/night
              </p>

              <h4 className="sub-heading">Bus Travel</h4>
              <p className="trip-bus">{pkg.bus}</p>

              <h4 className="sub-heading">Facilities</h4>
              <ul className="facility-list">
                {pkg.facility.map((fac, index) => (
                  <li key={index}>{fac}</li>
                ))}
              </ul>

              <p className="trip-price">₹{pkg.price} / Person</p>
              <button className="select-package-btn">
                {selected === pkg.id ? "Selected" : "Select Package"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageTrips;
