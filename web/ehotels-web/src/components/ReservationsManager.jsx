// File: src/components/ReservationsManager.jsx
import React, { useState } from 'react';

const ReservationsManager = () => {
  const [reservations, setReservations] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchReservations = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/reservations"); //
        const data = await res.json();
      setReservations(data);
      setLoaded(true);
    } catch (err) {
      console.error('Failed to fetch reservations', err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-3xl mx-auto mt-6">
      <h3 className="text-2xl font-bold mb-4">Reservations</h3>
      
      {!loaded ? (
        <button
          onClick={fetchReservations}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Load Reservations
        </button>
      ) : reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {reservations.map((r) => (
            <li key={r.reservation_id} className="p-4 border rounded shadow-sm bg-gray-50">
              <div><span className="font-semibold">Reservation ID:</span> {r.reservation_id}</div>
              <div><span className="font-semibold">Guest:</span> {r.guest_ssn}</div>
              <div><span className="font-semibold">Room:</span> {r.room_id}</div>
              <div><span className="font-semibold">From:</span> {r.check_in_date} <span className="font-semibold">to</span> {r.check_out_date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationsManager;
