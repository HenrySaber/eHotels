import React, { useState, useEffect } from 'react';

const hotelChains = [1, 2, 3, 4, 5];
const hotelCategories = ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"];

const RoomSearch = () => {
  const [filters, setFilters] = useState({
    check_in: '',
    check_out: '',
    capacity: '',
    area: '',
    hotelChain: '',
    hotelCategory: '',
    totalRooms: '',
    priceMin: '',
    priceMax: '',
    view: '',
    extendable: ''
  });

  const [rooms, setRooms] = useState([]);
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    handleSearch();
  }, []);

  const handleReset = () => {
    setFilters({
      check_in: '',
      check_out: '',
      capacity: '',
      area: '',
      hotelChain: '',
      hotelCategory: '',
      totalRooms: '',
      priceMin: '',
      priceMax: '',
      view: '',
      extendable: ''
    });
    handleSearch();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:3000/api/rooms/available?${query}`);
      const data = await res.json();
      setRooms(data);
      setConfirmation('');
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const handleBookRoom = async (room) => {
    const guest_ssn = "921-341-000";

    if (!filters.check_in || !filters.check_out) {
      setConfirmation("❌ Please select both check-in and check-out dates before booking.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          check_in_date: filters.check_in,
          check_out_date: filters.check_out,
          payment_status: true,
          room_id: room.room_id,
          guest_ssn,
          employee_ssn: null
        })
      });

      if (res.ok) {
        setConfirmation('✅ Booking confirmed!');
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
    <div className="container">
      <h2 className="heading">Search and Book Rooms</h2>
      <div className="grid grid-cols-3">
        <div className="form-group"><label>Check-In Date</label><input type="date" name="check_in" value={filters.check_in} onChange={handleChange} className="input" /></div>
        <div className="form-group"><label>Check-Out Date</label><input type="date" name="check_out" value={filters.check_out} onChange={handleChange} className="input" /></div>
        <div className="form-group"><label>Capacity</label><select name="capacity" value={filters.capacity} onChange={handleChange} className="input"><option value="">Any</option><option value="single">Single</option><option value="double">Double</option><option value="suite">Suite</option><option value="family">Family</option></select></div>
        <div className="form-group"><label>Room Size (sqft)</label><input type="number" name="area" value={filters.area} onChange={handleChange} className="input" /></div>
        <div className="form-group"><label>Hotel Chain ID</label><select name="hotelChain" value={filters.hotelChain} onChange={handleChange} className="input"><option value="">Any</option>{hotelChains.map(id => (<option key={id} value={id}>{id}</option>))}</select></div>
        <div className="form-group"><label>Hotel Category</label><select name="hotelCategory" value={filters.hotelCategory} onChange={handleChange} className="input"><option value="">Any</option>{hotelCategories.map((cat, idx) => (<option key={idx} value={cat}>{cat}</option>))}</select></div>
        <div className="form-group"><label>Total Rooms (min)</label><input type="number" name="totalRooms" value={filters.totalRooms} onChange={handleChange} className="input" /></div>
        <div className="form-group"><label>Min Price</label><input type="number" name="priceMin" value={filters.priceMin} onChange={handleChange} className="input" /></div>
        <div className="form-group"><label>Max Price</label><input type="number" name="priceMax" value={filters.priceMax} onChange={handleChange} className="input" /></div>
        <div className="form-group"><label>View</label><select name="view" value={filters.view} onChange={handleChange} className="input"><option value="">Any</option><option value="sea">Sea</option><option value="mountain">Mountain</option></select></div>
        <div className="form-group"><label>Extendable</label><select name="extendable" value={filters.extendable} onChange={handleChange} className="input"><option value="">Any</option><option value="yes">Yes</option><option value="no">No</option></select></div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button className="button" onClick={handleSearch}>Search</button>
        <button className="button" onClick={handleReset} style={{ marginLeft: '10px' }}>Reset</button>
      </div>

      {confirmation && <p className="mt-4 font-semibold">{confirmation}</p>}

      <div className="card mt-6">
        <h3 className="subheading">Available Rooms</h3>
        {rooms.length === 0 ? (
          <p>No matching rooms found.</p>
        ) : (
          <ul>
            {rooms.map(room => (
              <li key={room.room_id} className="card">
                <div>
                  <p><strong>Room #{room.room_id}</strong></p>
                  <p>Capacity: {room.capacity}</p>
                  <p>Size: {room.area} sqft</p>
                  <p>Hotel Chain ID: {room.chain_id}</p>
                  <p>Hotel Rating: {room.star_rating} ⭐</p>
                  <p>Total Rooms in Hotel: {room.number_of_rooms}</p>
                  <p>Price: ${room.price}</p>
                  <p>View: {room.sea_view ? 'Sea' : room.mountain_view ? 'Mountain' : 'None'}</p>
                  <p>Extendable: {room.extendable ? 'Yes' : 'No'}</p>
                </div>
                <button className="button" onClick={() => handleBookRoom(room)}>Book Room</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoomSearch;
