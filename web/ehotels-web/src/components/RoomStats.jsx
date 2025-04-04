import React, { useState, useEffect } from 'react';

const hotelZones = [
  'Riverside Ottawa',
  'Highland Montreal',
  'Aurora Toronto',
  'Beacon Quebec',
  'Rainford Vancouver'
];

const RoomStats = () => {
  const [selectedZone, setSelectedZone] = useState('');
  const [zoneStats, setZoneStats] = useState([]);
  const [hotelCapacity, setHotelCapacity] = useState([]);
  const [hotelId, setHotelId] = useState('');

  const fetchZoneStats = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/views/available-rooms-zone?zone=${encodeURIComponent(selectedZone)}`
      );
      const data = await res.json();
      setZoneStats(data);
    } catch (err) {
      console.error('Error fetching zone stats:', err);
    }
  };

  const fetchCapacityByHotel = async () => {
    if (!hotelId) return;
    try {
      const res = await fetch(`http://localhost:3000/api/views/room-capacity?hotel_id=${hotelId}`);
      const data = await res.json();
      setHotelCapacity(data);
    } catch (err) {
      console.error('Error fetching hotel capacity:', err);
    }
  };

  return (
    <div className="card">
      <h2 className="heading">Select Zone to View Available Rooms</h2>
      <select
        value={selectedZone}
        onChange={(e) => setSelectedZone(e.target.value)}
        className="input"
      >
        <option value="">Select Zone</option>
        {hotelZones.map((zone, i) => (
          <option key={i} value={zone}>{zone}</option>
        ))}
      </select>
      <button className="button mt-2" onClick={fetchZoneStats}>
        Fetch Zone Stats
      </button>

      <ul className="mt-2">
        {zoneStats.map((row, i) => (
          <li key={i}>
            Zone: {row.zone} — Available Rooms: {row.available_rooms}
          </li>
        ))}
      </ul>

      <hr className="my-4" />

      <h2 className="heading">Enter Hotel ID to View Room Capacity</h2>
      <input
        type="number"
        placeholder="Enter Hotel ID"
        value={hotelId}
        onChange={(e) => setHotelId(e.target.value)}
        className="input"
      />
      <button className="button mt-2" onClick={fetchCapacityByHotel}>
        Fetch Capacity
      </button>
      <ul className="mt-2">
        {hotelCapacity.map((row, i) => (
          <li key={i}>
            Capacity: {row.capacity} — Count: {row.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomStats;
