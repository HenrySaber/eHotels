// File: src/components/RoomsManager.jsx
import React, { useEffect, useState } from 'react';

const RoomsManager = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    price: '',
    capacity: '',
    area: '',
    sea_view: false,
    mountain_view: false,
    extendable: false,
    hotel_id: ''
  });

  const fetchRooms = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/rooms');
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRoom((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddRoom = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom)
      });

      if (res.ok) {
        setNewRoom({
          price: '',
          capacity: '',
          area: '',
          sea_view: false,
          mountain_view: false,
          extendable: false,
          hotel_id: ''
        });
        fetchRooms();
      } else {
        console.error('Failed to add room');
      }
    } catch (err) {
      console.error('Error adding room', err);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/rooms/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchRooms();
      } else {
        console.error('Failed to delete room');
      }
    } catch (err) {
      console.error('Error deleting room', err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h3 className="text-lg font-bold mb-4">Rooms</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <input name="price" type="number" placeholder="Price" className="border rounded p-2" value={newRoom.price} onChange={handleInputChange} />
        <select name="capacity" className="border rounded p-2" value={newRoom.capacity} onChange={handleInputChange}>
          <option value="">Select Capacity</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
          <option value="family">Family</option>
        </select>
        <input name="area" type="number" placeholder="Area (sqft)" className="border rounded p-2" value={newRoom.area} onChange={handleInputChange} />
        <input name="hotel_id" type="number" placeholder="Hotel ID" className="border rounded p-2" value={newRoom.hotel_id} onChange={handleInputChange} />
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="sea_view" checked={newRoom.sea_view} onChange={handleInputChange} />
          <span>Sea View</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="mountain_view" checked={newRoom.mountain_view} onChange={handleInputChange} />
          <span>Mountain View</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="extendable" checked={newRoom.extendable} onChange={handleInputChange} />
          <span>Extendable</span>
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded h-fit" onClick={handleAddRoom}>Add Room</button>
      </div>

      <ul className="space-y-2">
        {rooms.map((room) => (
          <li key={room.room_id} className="p-4 border rounded shadow-sm flex justify-between items-center">
            <span>
              Room #{room.room_id} | ${room.price} | {room.capacity} | Hotel ID: {room.hotel_id}
            </span>
            <button className="text-red-500" onClick={() => handleDeleteRoom(room.room_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsManager;