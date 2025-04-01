// File: src/components/AdminPanel.jsx
import React from 'react';
import RoomsManager from './RoomsManager';
import ReservationsManager from './ReservationsManager';
import GuestsManager from './GuestsManager';
import EmployeesManager from './EmployeesManager';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = React.useState('reservations');

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Menu</h2>
        <nav className="flex flex-col gap-2">
          <button className="text-left hover:bg-gray-700 p-2 rounded" onClick={() => setActiveTab('reservations')}>Reservations</button>
          <button className="text-left hover:bg-gray-700 p-2 rounded" onClick={() => setActiveTab('rooms')}>Rooms</button>
          <button className="text-left hover:bg-gray-700 p-2 rounded" onClick={() => setActiveTab('guests')}>Guests</button>
          <button className="text-left hover:bg-gray-700 p-2 rounded" onClick={() => setActiveTab('employees')}>Employees</button>
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'reservations' && <ReservationsManager />}
        {activeTab === 'rooms' && <RoomsManager />}
        {activeTab === 'guests' && <GuestsManager />}
        {activeTab === 'employees' && <EmployeesManager />}
      </main>
    </div>
  );
};

export default AdminPanel;