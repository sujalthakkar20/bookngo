import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [amenityInput, setAmenityInput] = useState("");
  const [recentRoutes, setRecentRoutes] = useState([]);

  const formRef = React.useRef(null);


  // ⭐ NEW — intermediate station input
  const [stationInput, setStationInput] = useState({
    stationName: "",
    arrivalTime: "",
    departureTime: "",
    priceFromStart: "",
  });

  const [formData, setFormData] = useState({
    busName: "",
    busNumber: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    date: new Date().toISOString().split("T")[0],
    price: "",
    totalSeats: 40,
    category: "AC",
    seatingType: "Seating",
    amenities: [],
    isActive: true,
    intermediateStations: [], // ⭐ NEW FIELD
  });

  // Auto-calc duration
  useEffect(() => {
    if (formData.departureTime && formData.arrivalTime) {
      const duration = calculateDuration(formData.departureTime, formData.arrivalTime);
      setFormData((prev) => ({ ...prev, duration }));
    }
  }, [formData.departureTime, formData.arrivalTime]);

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate("/login");
      return;
    }
    fetchBuses();
  }, [isAuthenticated, user, navigate]);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/buses");
      setBuses(res.data);

      const uniqueRoutes = [
        ...new Set(res.data.flatMap((b) => [b.from, b.to]).filter(Boolean)),
      ];
      setRecentRoutes(uniqueRoutes.slice(0, 10));
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch buses.");
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (start, end) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;
    if (endMinutes < startMinutes) endMinutes += 24 * 60;
    const diff = endMinutes - startMinutes;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  // ⭐ ADD INTERMEDIATE STATION
  const addIntermediateStation = () => {
    const { stationName, arrivalTime, departureTime, priceFromStart } = stationInput;

    if (!stationName || !arrivalTime || !departureTime || !priceFromStart) return;

    setFormData((prev) => ({
      ...prev,
      intermediateStations: [...prev.intermediateStations, stationInput],
    }));

    setStationInput({
      stationName: "",
      arrivalTime: "",
      departureTime: "",
      priceFromStart: "",
    });
  };

  // ⭐ REMOVE INTERMEDIATE STATION
  const removeIntermediateStation = (index) => {
    setFormData((prev) => ({
      ...prev,
      intermediateStations: prev.intermediateStations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        totalSeats: parseInt(formData.totalSeats),
        isActive: Boolean(formData.isActive),
      };

      if (editingBus) {
        await API.put(`/buses/${editingBus._id}`, payload);
        setMessage("✅ Bus updated successfully!");
      } else {
        await API.post("/buses", payload);
        setMessage("✅ Bus added successfully!");
      }

      resetForm();
      setShowForm(false);
      await fetchBuses();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error saving bus.");
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({
      busName: bus.busName,
      busNumber: bus.busNumber,
      from: bus.from,
      to: bus.to,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      duration: bus.duration,
      date: new Date(bus.date).toISOString().split("T")[0],
      price: bus.price,
      totalSeats: bus.totalSeats,
      category: bus.category,
      seatingType: bus.seatingType,
      amenities: bus.amenities || [],
      isActive: bus.isActive,
      intermediateStations: bus.intermediateStations || [], // ⭐ NEW
    });
    setShowForm(true);

      // ⭐ SCROLL TO FORM
  setTimeout(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bus?")) {
      try {
        await API.delete(`/buses/${id}`);
        setMessage("🗑️ Bus deleted!");
         fetchBuses();
      } catch (error) {
        setMessage(error.response?.data?.message || "Delete failed.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      busName: "",
      busNumber: "",
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      duration: "",
      date: new Date().toISOString().split("T")[0],
      price: "",
      totalSeats: 40,
      category: "AC",
      seatingType: "Seating",
      amenities: [],
      isActive: true,
      intermediateStations: [], // ⭐ RESET
    });
    setAmenityInput("");
    setStationInput({
      stationName: "",
      arrivalTime: "",
      departureTime: "",
      priceFromStart: "",
    });
    setEditingBus(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🚌 Admin Dashboard</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          Add New Bus
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      {/* =================== ADD / EDIT FORM =================== */}
      {showForm && (
        <div className="bus-form-container" ref={formRef}>
          <div className="bus-form">
            <h2>{editingBus ? "Edit Bus" : "Add New Bus"}</h2>
            <form onSubmit={handleSubmit}>
              
              {/* ---------- Existing form unchanged ---------- */}
               <div className="form-row">
                <div className="form-group">
                  <label>Bus Name *</label>
                  <input name="busName" value={formData.busName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Bus Number *</label>
                  <input name="busNumber" value={formData.busNumber} onChange={handleInputChange} required />
                </div>
              </div>

              {/* Route */}
              <div className="form-row">
                <div className="form-group">
                  <label>From *</label>
                  <input name="from" value={formData.from} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>To *</label>
                  <input name="to" value={formData.to} onChange={handleInputChange} required />
                </div>
              </div>

              {/* Time */}
              <div className="form-row">
                <div className="form-group">
                  <label>Departure Time *</label>
                  <input type="time" name="departureTime" value={formData.departureTime} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Arrival Time *</label>
                  <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input readOnly value={formData.duration} />
                </div>
              </div>

              {/* Date/Price/Seats */}
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Total Seats *</label>
                  <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleInputChange} required />
                </div>
              </div>

              {/* Category / Seating / Status */}
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option>AC</option>
                    <option>Non-AC</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Seating Type</label>
                  <select name="seatingType" value={formData.seatingType} onChange={handleInputChange}>
                    <option>Seating</option>
                    <option>Sleeper</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="isActive" value={formData.isActive} onChange={handleInputChange}>
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div className="form-group">
                <label>Amenities</label>
                <div className="amenities-input">
                  <input value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} placeholder="Add amenity" />
                  <button type="button" onClick={handleAddAmenity}>Add</button>
                </div>

                <div className="amenities-list">
                  {formData.amenities.map((a, i) => (
                    <span key={i} className="amenity-tag">
                      {a}
                      <button type="button" onClick={() => handleRemoveAmenity(i)}>×</button>
                    </span>
                  ))}
                </div>
              </div>


              {/* ---------------- INTERMEDIATE STATIONS ---------------- */}
              <h3>Intermediate Stations</h3>

              <div className="intermediate-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Station Name</label>
                    <input
                      type="text"
                      value={stationInput.stationName}
                      onChange={(e) =>
                        setStationInput({ ...stationInput, stationName: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Arrival Time</label>
                    <input
                      type="time"
                      value={stationInput.arrivalTime}
                      onChange={(e) =>
                        setStationInput({ ...stationInput, arrivalTime: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Departure Time</label>
                    <input
                      type="time"
                      value={stationInput.departureTime}
                      onChange={(e) =>
                        setStationInput({ ...stationInput, departureTime: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Price From Start (₹)</label>
                    <input
                      type="number"
                      value={stationInput.priceFromStart}
                      onChange={(e) =>
                        setStationInput({ ...stationInput, priceFromStart: e.target.value })
                      }
                    />
                  </div>
                </div>

                <button type="button" className="btn btn-small" onClick={addIntermediateStation}>
                  Add Station
                </button>
              </div>

              <div className="stations-list">
                {formData.intermediateStations.map((s, i) => (
                  <div key={i} className="station-tag">
                    <strong>{s.stationName}</strong> — Arr: {s.arrivalTime}, Dep:{" "}
                    {s.departureTime}, Price: ₹{s.priceFromStart}
                    <button
                      type="button"
                      onClick={() => removeIntermediateStation(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* ---------- Continue original form actions ---------- */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingBus ? "Update Bus" : "Add Bus"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =================== BUS TABLE =================== */}
      <div className="buses-table-container">
        <h2>All Buses ({buses.length})</h2>

        <table className="buses-table">
          <thead>
            <tr>
              <th>Bus Name</th>
              <th>Number</th>
              <th>Route</th>
              <th>Date</th>
              <th>Time</th>
              <th>Category</th>
              <th>Type</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Status</th>
              <th>Intermediate Stations</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {buses.length === 0 ? (
              <tr>
                <td colSpan="11" className="no-data">No buses found</td>
              </tr>
            ) : (
              buses.map((bus) => (
                <tr key={bus._id} className={!bus.isActive ? "inactive" : ""}>
                  <td>{bus.busName}</td>
                  <td>{bus.busNumber}</td>
                  <td>{bus.from} → {bus.to}</td>
                  <td>{new Date(bus.date).toLocaleDateString()}</td>
                  <td>{bus.departureTime} - {bus.arrivalTime}</td>
                  <td>{bus.category}</td>
                  <td>{bus.seatingType}</td>
                  <td>₹{bus.price}</td>
                  <td>{bus.availableSeats || bus.totalSeats}/{bus.totalSeats}</td>
                  <td>
                    <span className={`status-badge ${bus.isActive ? "active" : "inactive"}`}>
                      {bus.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td> 
                    {bus.intermediateStations?.length > 0 ? (
                      <ul className="station-list">
                        {bus.intermediateStations.map((s, i) => (
                          <li key={i}>
                            <strong>{s.stationName}</strong>
                            <br />Arr: {s.arrivalTime}, Dep: {s.departureTime}
                            <br />₹{s.priceFromStart}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "None"
                    )}
                  </td>

                  <td>
                    <button onClick={() => handleEdit(bus)} className="btn btn-small btn-edit">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bus._id)}
                      className="btn btn-small btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
