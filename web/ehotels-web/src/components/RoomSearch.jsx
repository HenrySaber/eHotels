// File: src/components/RoomSearch.jsx
import React, { useState } from 'react';

const RoomSearch = () => {
  const [filters, setFilters] = useState({
    capacity: '',
    area: '',
    view: '',
    hotel_id: ''
  });
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDates, setBookingDates] = useState({ check_in: '', check_out: '' });
  const [confirmation, setConfirmation] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/rooms`);
      const data = await res.json();

      const filtered = data.filter((room) => {
        const matchesCapacity = !filters.capacity || room.capacity.toLowerCase() === filters.capacity.toLowerCase();
        const matchesArea = !filters.area || room.area === parseInt(filters.area);
        const matchesHotelId = !filters.hotel_id || room.hotel_id === parseInt(filters.hotel_id);

        let matchesView = true;
        if (filters.view === 'sea') matchesView = room.sea_view;
        else if (filters.view === 'mountain') matchesView = room.mountain_view;

        return matchesCapacity && matchesArea && matchesHotelId && matchesView;
      });

      setRooms(filtered);
      setConfirmation('');
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setBookingDates({ check_in: '', check_out: '' });
    setConfirmation('');
  };

  const handleConfirmBooking = async () => {
    const guest_ssn = "921-341-000";

    if (!bookingDates.check_in || !bookingDates.check_out) {
      setConfirmation('❌ Please select both check-in and check-out dates.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          check_in_date: bookingDates.check_in,
          check_out_date: bookingDates.check_out,
          payment_status: true,
          room_id: selectedRoom.room_id,
          guest_ssn,
          employee_ssn: null
        })
      });

      if (res.ok) {
        setConfirmation('✅ Booking confirmed!');
        setSelectedRoom(null);
      } else {
        const errorData = await res.json();
        setConfirmation(`❌ Booking failed: ${errorData.error}`);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setConfirmation('❌ Server error while booking.');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-900 text-white pt-10">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-4xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Search and Book Rooms</h2>

        {/* Search Form */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <select name="capacity" value={filters.capacity} onChange={handleChange} className="p-3 bg-gray-700 rounded">
            <option value="">Room Capacity</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
            <option value="family">Family</option>
          </select>
          <input
            type="number"
            name="area"
            placeholder="Area (e.g., 22)"
            value={filters.area}
            onChange={handleChange}
            className="p-3 bg-gray-700 rounded"
          />
          <select name="view" value={filters.view} onChange={handleChange} className="p-3 bg-gray-700 rounded">
            <option value="">Any View</option>
            <option value="sea">Sea View</option>
            <option value="mountain">Mountain View</option>
          </select>
          <input
            type="number"
            name="hotel_id"
            placeholder="Hotel ID"
            value={filters.hotel_id}
            onChange={handleChange}
            className="p-3 bg-gray-700 rounded"
          />
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold"
          >
            Show Available Rooms
          </button>
        </div>

        {/* Booking Panel */}
        {selectedRoom && (
          <div className="mb-10 bg-gray-700 p-4 rounded text-center">
            <h3 className="text-xl font-semibold mb-2">Booking Room #{selectedRoom.room_id}</h3>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-4">
              <input
                type="date"
                value={bookingDates.check_in}
                onChange={(e) => setBookingDates({ ...bookingDates, check_in: e.target.value })}
                className="p-2 rounded bg-gray-600"
              />
              <input
                type="date"
                value={bookingDates.check_out}
                onChange={(e) => setBookingDates({ ...bookingDates, check_out: e.target.value })}
                className="p-2 rounded bg-gray-600"
              />
              <button
                onClick={handleConfirmBooking}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded"
              >
                Confirm Booking
              </button>
            </div>
            {confirmation && <p className="text-green-400">{confirmation}</p>}
          </div>
        )}

        {/* Room Results */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Available Rooms</h3>
          {rooms.length === 0 ? (
            <p className="text-gray-400 text-center">No matching rooms found.</p>
          ) : (
            <ul className="space-y-4">
              {rooms.map((room) => (
                <li key={room.room_id} className="bg-gray-700 p-4 rounded flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">Room #{room.room_id}</p>
                    <p>Capacity: {room.capacity}</p>
                    <p>View: {room.sea_view ? 'Sea' : room.mountain_view ? 'Mountain' : 'None'}</p>
                    <p>Area: {room.area}</p>
                    <p>Hotel ID: {room.hotel_id}</p>
                    <p>Price: ${room.price}</p>
                  </div>
                  <button
                    onClick={() => handleBookRoom(room)}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white font-semibold"
                  >
                    Book Room
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomSearch;
