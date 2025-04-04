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
      await fetch(`http://localhost:3000/api/reservations/${id}`, { method: 'DELETE' });
      fetchReservations();
    } catch (err) {
      console.error('Error deleting reservation', err);
    }
  };

  return (
    <div className="card" style={{ minHeight: '400px' }}>
      <h3>Reservations &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h3>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <ul>
          {reservations.map(r => (
            <li key={r.reservation_id} className="card">
              <p><strong>ID:</strong> {r.reservation_id}</p>
              <p><strong>Guest:</strong> {r.guest_ssn}</p>
              <p><strong>Room:</strong> {r.room_id || 'N/A'}</p>
              <p>
                <strong>From:</strong> {r.check_in_date?.split('T')[0]} <br />
                <strong>To:</strong> {r.check_out_date?.split('T')[0]}
              </p>
              <p><strong>Paid:</strong> {r.payment_status ? "✅" : "❌"}</p>
              <button className="button" onClick={() => handleDelete(r.reservation_id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationsManager;
