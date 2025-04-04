import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import RoomSearch from './components/RoomSearch';
import AdminPanel from './components/AdminPanel';
import RoomStats from './components/RoomStats'; // ✅ Import new component
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
          <Route path="/stats" element={<RoomStats />} /> {/* ✅ Add route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
