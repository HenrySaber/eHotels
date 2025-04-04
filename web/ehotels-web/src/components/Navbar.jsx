import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import hotelHubLogo from '../assets/HotelHub.png'; // adjust path as needed
import '../styles.css';

const Navbar = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-left">
          <img src={hotelHubLogo} alt="HotelHub Logo" className="navbar-logo" />
          <h1 className="navbar-brand">HotelHub</h1>
        </div>
        <div className="navbar-right">
          <Link to={isAdminPage ? "/search" : "/admin"} className="navbar-button">
            {isAdminPage ? "Switch to User" : "Switch to Admin"}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
