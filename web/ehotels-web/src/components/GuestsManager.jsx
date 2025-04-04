import React, { useState, useEffect } from 'react';

const GuestsManager = () => {
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({
    guest_ssn: '',
    first_name: '',
    last_name: '',
    address: ''
  });

  const fetchGuests = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/guests');
      const data = await res.json();
      setGuests(data);
    } catch (err) {
      console.error('Failed to fetch guests', err);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuest({ ...newGuest, [name]: value });
  };

  const handleAddGuest = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuest)
      });
      if (res.ok) {
        setNewGuest({ guest_ssn: '', first_name: '', last_name: '', address: '' });
        fetchGuests();
      } else {
        console.error('Failed to add guest');
      }
    } catch (err) {
      console.error('Error adding guest', err);
    }
  };

  const handleDeleteGuest = async (ssn) => {
    try {
      const res = await fetch(`http://localhost:3000/api/guests/${ssn}`, { method: 'DELETE' });
      if (res.ok) {
        fetchGuests();
      } else {
        console.error('Failed to delete guest');
      }
    } catch (err) {
      console.error('Error deleting guest', err);
    }
  };

  return (
    <div className="card">
      <h3>Guests</h3>
      <div className="form-container">
        <input type="text" name="guest_ssn" placeholder="SSN" className="input" value={newGuest.guest_ssn} onChange={handleInputChange} />
        <input type="text" name="first_name" placeholder="First Name" className="input" value={newGuest.first_name} onChange={handleInputChange} />
        <input type="text" name="last_name" placeholder="Last Name" className="input" value={newGuest.last_name} onChange={handleInputChange} />
        <input type="text" name="address" placeholder="Address" className="input" value={newGuest.address} onChange={handleInputChange} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <button className="button" onClick={handleAddGuest}>Add Guest</button>
      </div>
      {guests.length === 0 ? (
        <p>No guests found.</p>
      ) : (
        <ul>
          {guests.map(g => (
            <li
              key={g.guest_ssn}
              className="card"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span>{g.first_name} {g.last_name} | {g.address}</span>
              <button className="button" onClick={() => handleDeleteGuest(g.guest_ssn)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuestsManager;
