// File: src/components/GuestsManager.jsx
import React, { useState } from 'react';

const GuestsManager = () => {
  const [guests, setGuests] = useState([]);
  const [loaded, setLoaded] = useState(false);

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
      setLoaded(true);
    } catch (err) {
      console.error('Failed to fetch guests', err);
    }
  };

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
        fetchGuests(); // Refresh after adding
      } else {
        console.error('Failed to add guest');
      }
    } catch (err) {
      console.error('Error adding guest', err);
    }
  };

  const handleDeleteGuest = async (ssn) => {
    try {
      const res = await fetch(`http://localhost:3000/api/guests/${ssn}`, {
        method: 'DELETE'
      });

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
    <div className="bg-white shadow-md rounded p-6 max-w-4xl mx-auto mt-6">
      <h3 className="text-2xl font-bold mb-4">Guests</h3>

      <div className="flex flex-wrap gap-2 mb-6">
        <input name="guest_ssn" className="border rounded p-2 flex-1" placeholder="SSN" value={newGuest.guest_ssn} onChange={handleInputChange} />
        <input name="first_name" className="border rounded p-2 flex-1" placeholder="First Name" value={newGuest.first_name} onChange={handleInputChange} />
        <input name="last_name" className="border rounded p-2 flex-1" placeholder="Last Name" value={newGuest.last_name} onChange={handleInputChange} />
        <input name="address" className="border rounded p-2 flex-1" placeholder="Address" value={newGuest.address} onChange={handleInputChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAddGuest}>Add Guest</button>
      </div>

      {!loaded ? (
        <button
          onClick={fetchGuests}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Load Guests
        </button>
      ) : guests.length === 0 ? (
        <p>No guests found.</p>
      ) : (
        <ul className="space-y-2 mt-4">
          {guests.map((g) => (
            <li key={g.guest_ssn} className="p-4 border rounded shadow-sm flex justify-between items-center bg-gray-50">
              <span>
                {g.first_name} {g.last_name} | {g.address}
              </span>
              <button className="text-red-500 hover:underline" onClick={() => handleDeleteGuest(g.guest_ssn)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuestsManager;
