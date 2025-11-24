import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../utils/api";
import { API_ENDPOINTS } from "../config/api";
import "./BusSearch.css";

const BusSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [availableCount, setAvailableCount] = useState(0);


  const [filters] = useState({
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    date: searchParams.get("date") || new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await API.get(API_ENDPOINTS.BUSES.SEARCH, {
          params: filters,
        });

        if (!response.data || response.data.length === 0) {
          setErrorMessage("No buses found for your selected route and date.");
          setLoading(false);
          return;
        }

        let processed = [];

        response.data.forEach((bus) => {
          /** 🔹 MAIN ROUTE MATCH */
          if (
            bus.from.toLowerCase() === filters.from.toLowerCase() &&
            bus.to.toLowerCase() === filters.to.toLowerCase()
          ) {
            processed.push({
              bus,
              isIntermediate: false,
              finalFrom: bus.from,
              finalTo: bus.to,
              departureTime: bus.departureTime,
              arrivalTime: bus.arrivalTime,
              price: bus.price,
            });
          }

          /** 🔹 INTERMEDIATE ROUTE MATCH */
         /** 🔹 INTERMEDIATE ROUTE MATCH */
          bus.intermediateStations?.forEach((st, index) => {
            // Only consider stations after the starting point
            if (
              bus.from.toLowerCase() === filters.from.toLowerCase() &&
              st.stationName.toLowerCase() === filters.to.toLowerCase()
            ) {
              // Calculate segment price from start
              let segmentPrice = st.priceFromStart;

              // If there are intermediate stations before 'st', subtract their priceFromStart
              if (index > 0) {
                const prevStations = bus.intermediateStations.slice(0, index);
                const fromStationObj = prevStations.find(
                  (s) => s.stationName.toLowerCase() === filters.from.toLowerCase()
                );
                if (fromStationObj) {
                  segmentPrice = st.priceFromStart - fromStationObj.priceFromStart;
                }
              }

              processed.push({
                bus,
                isIntermediate: true,
                station: st,
                finalFrom: bus.from,
                finalTo: st.stationName,
                departureTime: bus.departureTime, // from main start
                arrivalTime: st.arrivalTime,      // arrival at intermediate
                price: segmentPrice,
              });
            }
          });

        });
        // 🔥 FILTER: Show only buses after current time for today's date
        if (filters.date === new Date().toISOString().split("T")[0]) {
          const now = new Date();

          processed = processed.filter((item) => {
            const busDateTime = new Date(`${filters.date}T${item.departureTime}:00`);
            return busDateTime > now;
          });
        }

        // ⭐ Count buses available after filtering
          setAvailableCount(processed.length);


        setBuses(processed.length > 0 ? processed : []);
        if (processed.length === 0) {
          setErrorMessage("No buses found for your selected route.");
        }
      } catch (error) {
        console.error("Error fetching buses:", error);
        setErrorMessage("Failed to fetch buses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [filters]);

const handleSelectBus = (item) => {
  const selected = {
    bus: item.bus,

    // ⭐ MAIN ROUTE
    searchSegment: item.isIntermediate
      ? {
          from: item.finalFrom,
          to: item.finalTo,
          departureTime: item.departureTime,
          arrivalTime: item.arrivalTime,
          segmentPrice: item.price,
        }
      : null,

    // ⭐ Legacy fields (if you need them)
    finalFrom: item.finalFrom,
    finalTo: item.finalTo,
    departureTime: item.departureTime,
    arrivalTime: item.arrivalTime,
    price: item.price,

    isIntermediate: item.isIntermediate,
  };

  sessionStorage.setItem("selectedBus", JSON.stringify(selected));
  navigate(`/seat-selection/${item.bus._id}`);
};


  return (
    <div className="bus-search-page">
      <div className="search-header">
        <h2>Available Buses</h2>
        <div className="search-info">
          <span>
            <h3>{filters.from} → {filters.to}</h3>
          </span>
          <span><h3>{new Date(filters.date).toLocaleDateString()}</h3></span>
        </div>
        <div className="bus-count">
          <h3>{availableCount} Buses</h3>
        </div>

      </div>

      {loading ? (
        <div className="loading">Loading buses...</div>
      ) : errorMessage ? (
        <div className="no-results">
          <h3>{errorMessage}</h3>
          <button onClick={() => navigate("/")} className="back-btn">
            Back to Home
          </button>
        </div>
      ) : (
        <div className="buses-list">
          {buses.map((item, index) => (
            <div key={index} className="bus-card">
              <div className="bus-info">
                <div className="bus-name">
                  {item.bus.busName}{" "}
                  <span className="bus-main-route">
                    (Main Route : {item.bus.from} → {item.bus.to})
                  </span>
                </div>


                {/* FULL ROUTE DISPLAY */}
                <div className="bus-route">
                  <span>
                    {item.finalFrom} → {item.finalTo}
                  </span>
                </div>

                <div className="bus-time">
                  <div>
                    <strong>Departure:</strong> {item.departureTime}
                  </div>
                  <div>
                    <strong>Arrival:</strong> {item.arrivalTime}
                  </div>
                </div>

                <div className="bus-type">
                  <strong>Type:</strong> {item.bus.category} / {item.bus.seatingType}
                </div>

                {item.bus.amenities?.length > 0 && (
                  <div className="bus-amenities">
                    <strong>Amenities:</strong> {item.bus.amenities.join(", ")}
                  </div>
                )}
              </div>

              <div className="bus-price">
                <div className="price">₹{item.price}</div>
                <button
                  onClick={() => handleSelectBus(item)}
                  className="select-btn"
                >
                  Select Seats
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusSearch;
