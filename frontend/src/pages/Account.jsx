import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import "./Account.css";

const Account = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [isAuthenticated, navigate]);

  // Fetch user profile
  const fetchUserData = async () => {
    try {
      const { data } = await API.get("/users/profile");
      setUserData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div className="account-page">
      <div className="account-container">
        <h2>My Account</h2>

        <div className="profile-view">
          <div className="profile-item">
            <label>Name :</label>
            <span>{userData.name}</span>
          </div>

          <div className="profile-item">
            <label>Email :</label>
            <span>{userData.email}</span>
          </div>

          <div className="profile-item">
            <label>Phone :</label>
            <span>{userData.phone}</span>
          </div>
        </div>

        <div className="account-actions">
          <button
            onClick={() => navigate("/my-bookings")}
            className="action-btn"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
