// File: src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-wide">eHotels</h1>

        <Link
          to={isAdminPage ? "/search" : "/admin"}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-all duration-200 font-medium"
        >
          {isAdminPage ? "Switch to User" : "Switch to Admin"}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
