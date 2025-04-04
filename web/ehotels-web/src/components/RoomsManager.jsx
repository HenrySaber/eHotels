import React, { useEffect, useState } from 'react';

const hotelChains = ["Chain 1", "Chain 2", "Chain 3", "Chain 4", "Chain 5"];
const hotelCategories = ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"];

const RoomsManager = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    price: '',
    capacity: '',
    area: '',
    hotel_id: '',
    view: 'none',
    extendable: '',
    hotelChain: '',
    hotelCategory: ''
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
    const { name, value, type } = e.target;
    setNewRoom(prev => ({
      ...prev,
      [name]: type === 'number' ? (value < 0 ? 0 : value) : value
    }));
  };

  const handleAddRoom = async () => {
    if (newRoom.extendable === "") {
      alert("Please select if the room is extendable.");
      return;
    }

    const roomData = {
      price: parseFloat(newRoom.price) || 100.00,
      capacity: newRoom.capacity || 'single',
      area: parseInt(newRoom.area) || 300,
      hotel_id: parseInt(newRoom.hotel_id) || 1,
      sea_view: newRoom.view === "sea",
      mountain_view: newRoom.view === "mountain",
      extendable: newRoom.extendable === "yes",
      problem_id: null,
      amenity_id: null,
      damages: '',
      hotel_chain: newRoom.hotelChain,
      hotel_category: newRoom.hotelCategory
    };

    try {
      const res = await fetch('http://localhost:3000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });
      if (res.ok) {
        setNewRoom({
          price: '',
          capacity: '',
          area: '',
          hotel_id: '',
          view: 'none',
          extendable: '',
          hotelChain: '',
          hotelCategory: ''
        });
        fetchRooms();
      } else {
        const err = await res.json();
        console.error('Failed to add room', err);
      }
    } catch (err) {
      console.error('Error adding room', err);
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/rooms/${id}`, { method: 'DELETE' });
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
    <div className="card">
      <h3>Rooms</h3>
      <div className="form-container grid grid-cols-2">
        <input type="number" name="price" min="0" placeholder="Price" className="input" value={newRoom.price} onChange={handleInputChange} />
        <select name="capacity" className="input" value={newRoom.capacity} onChange={handleInputChange}>
          <option value="">Select Capacity</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
          <option value="family">Family</option>
        </select>
        <input type="number" name="area" min="0" placeholder="Room Size (sqft)" className="input" value={newRoom.area} onChange={handleInputChange} />
        <input type="number" name="hotel_id" min="0" placeholder="Hotel ID" className="input" value={newRoom.hotel_id} onChange={handleInputChange} />
        <select name="view" className="input" value={newRoom.view} onChange={handleInputChange}>
          <option value="none">No View</option>
          <option value="sea">Sea View</option>
          <option value="mountain">Mountain View</option>
        </select>
        <select name="extendable" className="input" value={newRoom.extendable} onChange={handleInputChange}>
          <option value="">Select if extendable</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <select name="hotelChain" className="input" value={newRoom.hotelChain} onChange={handleInputChange}>
          <option value="">Select Hotel Chain</option>
          {hotelChains.map((chain, idx) => (
            <option key={idx} value={chain}>{chain}</option>
          ))}
        </select>
        <select name="hotelCategory" className="input" value={newRoom.hotelCategory} onChange={handleInputChange}>
          <option value="">Select Hotel Category</option>
          {hotelCategories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        <button className="button" onClick={handleAddRoom}>Add Room</button>
      </div>

      <ul>
        {rooms.map(room => (
          <li key={room.room_id} className="card">
            <div>
              <p><strong>Room #{room.room_id}</strong></p>
              <p>Price: ${room.price}</p>
              <p>Capacity: {room.capacity}</p>
              <p>Size: {room.area} sqft</p>
              <p>Hotel ID: {room.hotel_id}</p>
              <p>Chain: {room.hotel_chain || 'N/A'}</p>
              <p>Category: {room.hotel_category || 'N/A'}</p>
              <p>View: {room.sea_view ? "Sea View" : room.mountain_view ? "Mountain View" : "None"}</p>
              <p>Extendable: {room.extendable ? "Yes" : "No"}</p>
            </div>
            <button className="button" onClick={() => handleDeleteRoom(room.room_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsManager;