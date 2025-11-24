import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Go to Packages Page (Login required)
  const handlePackageTrips = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/packages");
  };

  // 🟦 NEW: Bus Tickets navigation → Home page
  const handleBusTickets = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo + Categories */}
        <div className="logo-categories">
          <Link to="/" className="logo">
            <i className="fas fa-bus"></i>
            <span>BookNGo</span>
          </Link>

          <div className="main-categories">

            {/* 🟦 Bus Tickets Clickable */}
            <button className="category-item category-btn" onClick={handleBusTickets}>
              Bus Tickets
            </button>

            {/* ⭐ Package Trips Beside Bus Tickets */}
            <button className="category-item category-btn" onClick={handlePackageTrips}>
              Package Trips
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav-links">

          <Link to="/wallet" className="nav-link">
            <i className="fas fa-wallet"></i>
            <span>Wallet</span>
          </Link>

          {isAuthenticated && isAdmin && (
            <Link to="/admin/dashboard" className="nav-link">
              <i className="fas fa-tools"></i>
              <span>Admin</span>
            </Link>
          )}

          <Link to="/my-bookings" className="nav-link">
            <i className="far fa-calendar"></i>
            <span>Bookings</span>
          </Link>

          <Link to="/help" className="nav-link">
            <i className="far fa-question-circle"></i>
            <span>Help</span>
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/account" className="nav-link">
                <i className="far fa-user"></i>
                <span>{user?.name || 'Account'}</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link">
              <i className="far fa-user"></i>
              <span>Account</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
