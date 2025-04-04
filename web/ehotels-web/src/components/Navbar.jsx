import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import hotelHubLogo from '../assets/HotelHub.png'; // adjust path as needed
import '../styles.css';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const views = [
    { path: '/search', label: 'User View' },
    { path: '/admin', label: 'Admin View' },
    { path: '/stats', label: 'Room Stats' }
  ];

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-left">
          <img src={hotelHubLogo} alt="HotelHub Logo" className="navbar-logo" />
          <h1 className="navbar-brand">HotelHub</h1>
        </div>
        <div className="navbar-right">
          {views
            .filter(view => view.path !== path)
            .map(view => (
              <Link key={view.path} to={view.path} className="navbar-button">
                {view.label}
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
