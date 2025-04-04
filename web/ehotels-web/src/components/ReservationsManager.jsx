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

  const handleTogglePayment = (id) => {
    setReservations(prev =>
      prev.map(r => r.reservation_id === id ? { ...r, payment_status: !r.payment_status } : r)
    );
  };

  const handleDateChange = (id, field, value) => {
    setReservations(prev =>
      prev.map(r =>
        r.reservation_id === id ? { ...r, [field]: value } : r
      )
    );
  };

  const handleUpdate = async (reservation) => {
    try {
      const res = await fetch(`http://localhost:3000/api/reservations/${reservation.reservation_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation)
      });
      if (!res.ok) throw new Error('Failed to update reservation');
      alert('✅ Reservation updated');
      fetchReservations();
    } catch (err) {
      console.error('Update error', err);
      alert('❌ Failed to update reservation');
    }
  };

  return (
    <div className="card" style={{ minHeight: '400px' }}>
      <h3>Reservations</h3>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <ul>
          {reservations.map(r => (
            <li key={r.reservation_id} className="card">
              <p><strong>ID:</strong> {r.reservation_id}</p>
              <p><strong>Guest:</strong> {r.guest_ssn}</p>
              <p><strong>Room:</strong> {r.room_id || 'N/A'}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>Check-In:</label>
                  <input
                    type="date"
                    value={r.check_in_date?.split('T')[0]}
                    onChange={(e) => handleDateChange(r.reservation_id, 'check_in_date', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label>Check-Out:</label>
                  <input
                    type="date"
                    value={r.check_out_date?.split('T')[0]}
                    onChange={(e) => handleDateChange(r.reservation_id, 'check_out_date', e.target.value)}
                    className="input"
                  />
                </div>
              </div>
              <p>
                <strong>Paid:</strong>
                <button
                  className="ml-2 button"
                  style={{ backgroundColor: r.payment_status ? '#22c55e' : '#ef4444' }}
                  onClick={() => handleTogglePayment(r.reservation_id)}
                >
                  {r.payment_status ? '✅ Paid' : '❌ Unpaid'}
                </button>
              </p>
              <div className="mt-2">
                <button className="button" onClick={() => handleUpdate(r)}>Update</button>
                <button className="button ml-2" onClick={() => handleDelete(r.reservation_id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReservationsManager;
