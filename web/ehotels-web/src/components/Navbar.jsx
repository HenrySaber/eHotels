// File: src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">eHotels</h1>
        <ul className="flex gap-6 text-sm md:text-base">
          <li>
            <Link to="/search" className="hover:text-blue-400 transition">Search Rooms</Link>
          </li> 
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;