//File: src/components/RoomSearch.jsx
import React, { useState } from 'react';

const RoomSearch = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [results, setResults] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestInfo, setGuestInfo] = useState({
    guest_ssn: '',
    first_name: '',
    last_name: '',
    address: ''
  });

  const handleSearch = async () => {
    try {
      const url = `http://localhost:3000/api/rooms/available?check_in=${checkIn}&check_out=${checkOut}`;
      const response = await fetch(url);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching available rooms:', error);
    }
  };

  const handleBook = (room) => {
    setSelectedRoom(room);
  };

  const handleGuestChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmBooking = async () => {
    try {
      // Add guest first
      await fetch('http://localhost:3000/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guestInfo)
      });

      // Then add reservation
      await fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          check_in_date: checkIn,
          check_out_date: checkOut,
          payment_status: true,
          room_id: selectedRoom.room_id,
          guest_ssn: guestInfo.guest_ssn,
          employee_ssn: null
        })
      });

      alert('✅ Room successfully booked!');
      setGuestInfo({ guest_ssn: '', first_name: '', last_name: '', address: '' });
      setSelectedRoom(null);
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Search Available Rooms</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="border rounded px-4 py-2 flex-1"
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="border rounded px-4 py-2 flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((room) => (
            <li
              key={room.room_id}
              className="p-4 border rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Room #{room.room_id}</p>
                <p>{room.capacity} | ${room.price}</p>
                <p>Hotel ID: {room.hotel_id}</p>
              </div>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => handleBook(room)}
              >
                Book
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No rooms to display. Please search above.</p>
      )}

      {selectedRoom && (
        <div className="mt-10 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Enter Your Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="border rounded p-2"
              name="guest_ssn"
              placeholder="SSN"
              value={guestInfo.guest_ssn}
              onChange={handleGuestChange}
            />
            <input
              className="border rounded p-2"
              name="first_name"
              placeholder="First Name"
              value={guestInfo.first_name}
              onChange={handleGuestChange}
            />
            <input
              className="border rounded p-2"
              name="last_name"
              placeholder="Last Name"
              value={guestInfo.last_name}
              onChange={handleGuestChange}
            />
            <input
              className="border rounded p-2"
              name="address"
              placeholder="Address"
              value={guestInfo.address}
              onChange={handleGuestChange}
            />
          </div>
          <button
            onClick={handleConfirmBooking}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomSearch;