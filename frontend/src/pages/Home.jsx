import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");
  const [openFaq, setOpenFaq] = useState(null);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: new Date().toISOString().split("T")[0],
  });

  // 🔹 Suggestion States
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // 🔹 FAQs (unchanged)
  const faqs = {
    general: [
      {
        question: "What are the advantages of bus ticket booking with BookNGo?",
        answer:
          "BookNGo offers easy booking, multiple payment options, 24/7 customer support, best prices, and secure transactions.",
      },
      {
        question: "Can I track the location of my booked bus online?",
        answer:
          "No, you can not track your bus location.",
      },
      {
        question: "How do I create an account on BookNGo?",
        answer:
          'Click on "Account" → "Register", fill in your details, and start booking!',
      },
    ],
    ticket: [
      {
        question: "Can I modify my booking after confirmation?",
        answer:
          "No, modifications are not allowed.",
      },
      {
        question: "What if I lose my ticket?",
        answer:
          'You can re-download it anytime from your "My Bookings" section.',
      },
      {
        question: "Can I book tickets for multiple passengers?",
        answer:
          "Yes, multiple seats can be booked in a single booking during seat selection.",
      },
    ],
    payment: [
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept Credit/Debit Cards, Net Banking, Wallets and UPI like GooglePay, Paytm, PhonePe, etc.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, all payments are processed via secure gateways. We don’t store card details.",
      },
      {
        question: "What if my payment fails?",
        answer:
          "If your payment fails, refunds are processed in 5-7 business days.",
      },
    ],
    cancellation: [
      {
        question: "Can I cancel my booking?",
        answer:
          "Yes, through 'My Bookings'. Refunds depend on cancellation time and policy.",
      },
      {
        question: "What is the refund policy?",
        answer:
          "Full refund if canceled 24h before departure. Partial refund after that.",
      },
      {
        question: "How long does a refund take?",
        answer: "Refunds are processed within 5–7 business days.",
      },
    ],
  };

  // 🔹 Fetch suggestions dynamically from DB
  const fetchSuggestions = async (field, value) => {
  if (!value.trim()) {
    if (field === "from") setFromSuggestions([]);
    else setToSuggestions([]);
    return;
  }

  try {
    const res = await API.get("/buses/suggestions", {
      params: { type: field, query: value }
    });

    const cities = res.data.map((c) => c.toLowerCase());

    if (field === "from") 
      setFromSuggestions(cities);
    else 
      setToSuggestions(cities);

  } catch (err) {
    console.error("Error fetching suggestions:", err);
  }
};


  const handleInputChange = (field, value) => {
    setSearchData({ ...searchData, [field]: value });
    if (field === "from") {
      setShowFromSuggestions(true);
      fetchSuggestions("from", value);
    } else {
      setShowToSuggestions(true);
      fetchSuggestions("to", value);
    }
  };

  const handleSuggestionSelect = (field, value) => {
    setSearchData({ ...searchData, [field]: value });
    if (field === "from") {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  };

  const handleKeyDown = (e, field) => {
    const suggestions = field === "from" ? fromSuggestions : toSuggestions;
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = suggestions[activeSuggestionIndex];
      if (selected) handleSuggestionSelect(field, selected);
      setActiveSuggestionIndex(-1);
    }
  };

const handleSearch = async (e) => {
  e.preventDefault();
  if (!searchData.from || !searchData.to) return;

  setLoading(true);
  setSearched(true);
  setBuses([]);

  try {
    const res = await API.get("/buses/search", { params: searchData });
    setBuses(res.data || []);

    // ✅ Navigate to results page with query params
    const query = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
    }).toString();

    navigate(`/results?${query}`);
  } catch (err) {
    console.error("Error fetching buses:", err);
  } finally {
    setLoading(false);
  }
};


  const setToday = () =>
    setSearchData({
      ...searchData,
      date: new Date().toISOString().split("T")[0],
    });

  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSearchData({
      ...searchData,
      date: tomorrow.toISOString().split("T")[0],
    });
  };

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);
  const go = (path) => navigate(path);
  const handleKeyActivate = (e, path) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go(path);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target))
        setShowFromSuggestions(false);
      if (toRef.current && !toRef.current.contains(e.target))
        setShowToSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-background" />
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">No. 1</span> Online Bus Ticket
          </h1>
          <h1 className="nhero-title">
             Booking Site
          </h1>

          {/* SEARCH FORM */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-fields">
              {/* FROM FIELD */}
              <div className="search-field" ref={fromRef}>
                <i className="fas fa-bus" />
                <input
                  type="text"
                  placeholder="From"
                  value={searchData.from}
                  onChange={(e) => handleInputChange("from", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "from")}
                  required
                />
                {showFromSuggestions && fromSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {fromSuggestions.map((s, i) => (
                      <li
                        key={i}
                        className={
                          i === activeSuggestionIndex ? "active-suggestion" : ""
                        }
                        onClick={() => handleSuggestionSelect("from", s)}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* TO FIELD */}
              <div className="search-field" ref={toRef}>
                <i className="fas fa-bus" />
                <input
                  type="text"
                  placeholder="To"
                  value={searchData.to}
                  onChange={(e) => handleInputChange("to", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "to")}
                  required
                />
                {showToSuggestions && toSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {toSuggestions.map((s, i) => (
                      <li
                        key={i}
                        className={
                          i === activeSuggestionIndex ? "active-suggestion" : ""
                        }
                        onClick={() => handleSuggestionSelect("to", s)}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* DATE FIELD */}
              <div className="search-field date-field">
                <i className="far fa-calendar" />
                <input
                  type="date"
                  value={searchData.date}
                  onChange={(e) =>
                    setSearchData({ ...searchData, date: e.target.value })
                  }
                  required
                />
                <div className="date-buttons">
                  <button type="button" onClick={setToday} className="date-btn">
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={setTomorrow}
                    className="date-btn"
                  >
                    Tomorrow
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="search-btn">
              <i className="fas fa-search" /> Search Buses
            </button>
          </form>

          <div className="festival-banner">
            <i className="fas fa-bus" />
            <div>
              <h3>Book bus for festivals</h3>
              <p>Book now to get confirmed ticket</p>
            </div>
            <button onClick={() => go("/")} className="festival-cta">
              Explore Buses
            </button>
          </div>
        </div>
      </section>

      {/* ✅ FIXED: SHOW RESULTS PROPERLY BELOW HERO */}
      {searched && (
        <section className="bus-results-section">
          <h2>Available Buses</h2>
          {loading ? (
            <p>Loading buses...</p>
          ) : buses.length === 0 ? (
            <p>No buses found for this route.</p>
          ) : (
            <div className="bus-results-list scrollable">
              {buses.map((bus) => (
                <div key={bus._id} className="bus-card">
                  <div>
                    <h3>{bus.busName}</h3>
                    <p>
                      {bus.from} → {bus.to}
                    </p>
                    <p>Date: {new Date(bus.date).toLocaleDateString()}</p>
                  </div>
                  <div className="bus-price">₹{bus.price}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}



      {/* PROMO SECTION */}
      <section className="promotional-section">
        <div className="promo-card purple">
          <h3>Get ₹70 off using code FESTIVAL</h3>
          <button onClick={() => go("/")}>Book bus now</button>
        </div>
        <div className="promo-card blue">
          <h3>Nov Guru Nanak Jayanti</h3>
          <button onClick={() => go("/")}>Book bus now</button>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <h1>1,000+ People Booked Across India</h1>
        <p>On BookNGo last month</p>
      </section>

      {/* OFFERS SECTION */}
      <section className="offers-section">
        <h2>Offers for you</h2>
        <div className="offers-grid">
          <div className="offer-card">
            <div className="offer-icon">🚌</div>
            <h3>Save up to Rs 300 on bus tickets</h3>
            <p>Valid till 06 Dec</p>
            <div className="promo-code">FESTIVAL300</div>
          </div>

          <div className="offer-card">
            <div className="offer-icon">⭐</div>
            <h3>Save up to Rs 500 on bus tickets</h3>
            <p>Valid till 30 Nov</p>
            <div className="promo-code">BOOKNGO500</div>
          </div>

          <div className="offer-card">
            <div className="offer-icon">🚌</div>
            <h3>Save up to Rs 250 on bus tickets</h3>
            <p>Valid till 01 Dec</p>
            <div className="promo-code">FIRST</div>
          </div>

          <div className="offer-card">
            <div className="offer-icon">🏦</div>
            <h3>Save upto Rs 500 with Axis Bank Credit Cards</h3>
            <p>Valid till 09 Oct</p>
            <div className="promo-code">AXIS300</div>
          </div>
        </div>
      </section>

      {/* WHAT'S NEW */}
      <section className="whats-new-section">
        <h2>What's new.</h2>
        <div className="features-grid">
          <div
            className="feature-card"
            role="button"
            tabIndex={0}
            onClick={() => go("/free-cancellation")}
            onKeyDown={(e) => handleKeyActivate(e, "/free-cancellation")}
          >
            <div className="feature-icon green" aria-hidden>
              💰
            </div>
            <h3>Free Cancellation</h3>
            <p>Get 100% refund on cancellation.</p>
            <div className="know-more">Know More →</div>
          </div>

          <div
            className="feature-card"
            role="button"
            tabIndex={0}
            onClick={() => go("/bus-timetable")}
            onKeyDown={(e) => handleKeyActivate(e, "/bus-timetable")}
          >
            <div className="feature-icon blue" aria-hidden>
              📅
            </div>
            <h3>Introducing Bus Timetable</h3>
            <p>Get local bus timings between cities in your state.</p>
            <div className="know-more">Know More →</div>
          </div>

          <div
            className="feature-card"
            role="button"
            tabIndex={0}
            onClick={() => go("/flexi-ticket")}
            onKeyDown={(e) => handleKeyActivate(e, "/flexi-ticket")}
          >
            <div className="feature-icon purple" aria-hidden>
              🔄
            </div>
            <h3>FlexiTicket</h3>
            <p>Enjoy benefits on Date Change & Cancellation.</p>
            <div className="know-more">Know More →</div>
          </div>

          <div
            className="feature-card"
            role="button"
            tabIndex={0}
            onClick={() => go("/assurance-program")}
            onKeyDown={(e) => handleKeyActivate(e, "/assurance-program")}
          >
            <div className="feature-icon yellow" aria-hidden>
              ✖️
            </div>
            <h3>Assurance Program</h3>
            <p>Insure your trip against cancellations & accidents.</p>
            <div className="know-more">Know More →</div>
          </div>
        </div>
      </section>

      {/* WHY TRAVEL */}
      <section className="why-section">
        <h2>Why travel with BookNGo?</h2>
        <div className="why-grid">
          <div className="why-card">
            <i className="fas fa-globe" />
            <h3>2000+</h3>
            <p>Routes across India</p>
          </div>
          <div className="why-card">
            <i className="fas fa-handshake" />
            <h3>100%</h3>
            <p>Trusted operators</p>
          </div>
          <div className="why-card">
            <i className="fas fa-trophy"></i>
            <h3>10+</h3>
            <p>year of Experience.</p>
          </div>
          <div className="why-card">
            <i className="fas fa-smile" />
            <h3>90%</h3>
            <p>Happy travellers</p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <h2>FAQs Related to Bus Booking</h2>

        <div className="faq-tabs">
          {["general", "ticket", "payment", "cancellation"].map((tab) => (
            <button
              key={tab}
              className={`faq-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="faq-list">
          {faqs[activeTab].map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openFaq === index ? "active" : ""}`}
            >
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                <span>{faq.question}</span>
                <i
                  className={`fas fa-chevron-${
                    openFaq === index ? "up" : "down"
                  }`}
                ></i>
              </div>
              {openFaq === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
