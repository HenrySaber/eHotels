import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RoomSearch from './components/RoomSearch';
import AdminPanel from './components/AdminPanel';
import './styles.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/search" element={<RoomSearch />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/contact" element={<p className="heading">Feel free to reach out to us via email or phone.</p>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;