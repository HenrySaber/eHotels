// File: src/components/ReservationsManager.jsx
import React, { useEffect, useState } from 'react';

const ReservationsManager = () => {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/reservations");
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/reservations/${id}`, {
        method: 'DELETE',
      });
      fetchReservations();
    } catch (err) {
      console.error('Error deleting reservation', err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6 max-w-4xl mx-auto mt-6">
      <h3 className="text-2xl font-bold mb-6 text-center">Reservations</h3>

      {reservations.length === 0 ? (
        <p className="text-center text-gray-600">No reservations found.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((r) => (
            <li
              key={r.reservation_id}
              className="p-4 border rounded shadow-sm bg-gray-50 space-y-2"
            >
              <p><span className="font-semibold">ID:</span> {r.reservation_id}</p>
              <p><span className="font-semibold">Guest:</span> {r.guest_ssn}</p>
              <p><span className="font-semibold">Room:</span> {r.room_id || 'N/A'}</p>
              <p>
                <span className="font-semibold">From:</span> {r.check_in_date?.split('T')[0]} <br />
                <span className="font-semibold">To:</span> {r.check_out_date?.split('T')[0]}
              </p>
              <p>
                <span className="font-semibold">Paid:</span> {r.payment_status ? "✅" : "❌"}
              </p>
              <button
                onClick={() => handleDelete(r.reservation_id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationsManager;
