// src/pages/FeatureDetail.jsx
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './FeatureDetail.css';

const FEATURE_MAP = {
  'free-cancellation': {
    title: 'Free Cancellation',
    description:
      'Get 100% refund on cancellation. Cancel up to 6 hours before departure and receive the refund to your original payment method. Instant confirmation via SMS and email.',
    icon: '💰',
    colorClass: 'green',
  },
  'bus-timetable': {
    title: 'Introducing Bus Timetable',
    description:
      'Find up-to-date bus schedules between cities, view stops and route duration, and plan your travel with real-time updates.',
    icon: '📅',
    colorClass: 'blue',
  },
  'flexi-ticket': {
    title: 'FlexiTicket',
    description:
      'FlexiTicket allows one-time date changes for selected operators and reduced penalties for cancellations. Ideal for flexible travellers.',
    icon: '🔄',
    colorClass: 'purple',
  },
  'assurance-program': {
    title: 'Assurance Program',
    description:
      'Opt-in insurance covering cancellations, delays, lost luggage and priority support during travel. Claims processed quickly through our support team.',
    icon: '✖️',
    colorClass: 'yellow',
  },
};

const FeatureDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const state = location.state;

  // prefer passed state (when navigated from Home). Otherwise use the map based on URL param.
  const data =
    state && state.title && state.description
      ? {
          title: state.title,
          description: state.description,
          icon: state.icon || 'ℹ️',
          colorClass: state.color || '',
        }
      : FEATURE_MAP[params.name] || {
          title: 'Feature',
          description: 'Details not available.',
          icon: 'ℹ️',
          colorClass: '',
        };

  return (
    <div className="feature-detail">
      <div className={`feature-detail-card ${data.colorClass}`}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="icon">{data.icon}</div>
        <h1>{data.title}</h1>
        <p>{data.description}</p>

        {/* Example: more structured content for Free Cancellation */}
        {params.name === 'free-cancellation' && (
          <>
            <h2>How it works</h2>
            <ul>
              <li>Available on participating operators.</li>
              <li>Cancel up to 6 hours before departure for full refund.</li>
              <li>Refund is processed to your original payment method.</li>
            </ul>
            <h2>How to cancel</h2>
            <ol>
              <li>Open My Bookings</li>
              <li>Select the ticket</li>
              <li>Click Cancel Ticket and confirm</li>
            </ol>
          </>
        )}

        {/* CTA */}
        <div style={{ marginTop: 18 }}>
          <button className="primary-btn" onClick={() => navigate('/search')}>
            Search Buses
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetail;
