// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RoomSearch from './components/RoomSearch';
import AdminPanel from './components/AdminPanel';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<h2 className="text-xl font-bold">Welcome to eHotels!</h2>} />
          <Route path="/search" element={<RoomSearch />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/contact" element={<p className="text-lg">Feel free to reach out to us via email or phone.</p>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;