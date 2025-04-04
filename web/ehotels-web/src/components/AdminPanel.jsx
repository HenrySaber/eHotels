import React from 'react';
import RoomsManager from './RoomsManager';
import ReservationsManager from './ReservationsManager';
import GuestsManager from './GuestsManager';
import EmployeesManager from './EmployeesManager';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = React.useState('reservations');

  return (
    <div className="flex" style={{ minHeight: "100vh" }}>
      <aside className="sidebar">
        <h2>Admin Menu</h2>
        <nav>
          <button className={`nav-button ${activeTab === 'reservations' ? 'active' : ''}`} onClick={() => setActiveTab('reservations')}>
            Reservations
          </button>
          <button className={`nav-button ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>
            Rooms
          </button>
          <button className={`nav-button ${activeTab === 'guests' ? 'active' : ''}`} onClick={() => setActiveTab('guests')}>
            Guests
          </button>
          <button className={`nav-button ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
            Employees
          </button>
        </nav>
      </aside>
      <main className="container">
        {activeTab === 'reservations' && <ReservationsManager />}
        {activeTab === 'rooms' && <RoomsManager />}
        {activeTab === 'guests' && <GuestsManager />}
        {activeTab === 'employees' && <EmployeesManager />}
      </main>
    </div>
  );
};

export default AdminPanel;
