import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './PageStyle.css';
import { color } from 'framer-motion';

const Pricing = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const go = (path) => navigate(path);

  const pricingData = [
    {
      type: 'AC Sleeper Bus',
      price: '₹800 – ₹1200',
      features: [
        'Comfortable recliner seats',
        'Full air conditioning',
        'Charging ports & blankets',
        'Live GPS tracking',
      ],
      color: '#0056b3',
    },
    {
      type: 'Non-AC Seater Bus',
      price: '₹400 – ₹700',
      features: [
        'Affordable travel option',
        'Spacious legroom',
        'Clean and well-maintained seats',
        'Multiple route availability',
      ],
     color: '#0056b3',
    },
    {
      type: 'Volvo Luxury Bus',
      price: '₹1200 – ₹2000',
      features: [
        'Premium comfort experience',
        'Wi-Fi and entertainment system',
        'Water bottles & onboard meals',
        'Personal reading lights',
      ],
      color: '#0056b3',
    },
    {
      type: 'Electric Eco Bus',
      price: '₹900 – ₹1300',
      features: [
        'Eco-friendly zero-emission ride',
        'Silent cabin and air purification',
        'USB charging & LED lighting',
        'Priority boarding',
      ],
     color: '#0056b3',
    },
  ];

  const filteredData =
    filter === 'All' ? pricingData : pricingData.filter((item) => item.type === filter);

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <h1>Bus Ticket Pricing</h1>
   <p className="intro-text white-text">
        Choose your comfort, control your cost — transparent fares for every traveler.
      </p>
      </section>

      {/* Filter Buttons */}
      <div className="pricing-filters">
        <button
          className={filter === 'All' ? 'active' : ''}
          onClick={() => setFilter('All')}
        >
          All
        </button>
        {pricingData.map((plan) => (
          <button
            key={plan.type}
            className={filter === plan.type ? 'active' : ''}
            onClick={() => setFilter(plan.type)}
          >
            {plan.type}
          </button>
        ))}
      </div>

      {/* Pricing Cards */}
      <div className="pricing-card-container">
        {filteredData.map((plan) => (
          <div className="pricing-card" key={plan.type}>
            <div className="pricing-header" style={{ backgroundColor: plan.color }}>
              <h2>{plan.type}</h2>
              <h3>{plan.price}</h3>
            </div>
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>✅ {feature}</li>
              ))}
            </ul>
            <button onClick={() => go("/")} className="book-btn">Book Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
