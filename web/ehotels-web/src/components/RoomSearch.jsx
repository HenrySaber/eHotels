import React, { useState, useEffect } from 'react';

const hotelChains = ["Chain A", "Chain B", "Chain C", "Chain D", "Chain E"];
const hotelCategories = ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"];

const RoomSearch = () => {
  const [filters, setFilters] = useState({
    check_in: '',
    check_out: '',
    capacity: '',
    roomSize: '',
    hotelChain: '',
    hotelCategory: '',
    totalRooms: '',
    priceMin: '',
    priceMax: '',
    view: '',
    extendable: ''
  });
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDates, setBookingDates] = useState({ check_in: '', check_out: '' });
  const [confirmation, setConfirmation] = useState('');

  // On mount, load all available rooms
  useEffect(() => {
    handleSearch();
  }, []);

  const handleReset = () => {
    setFilters({
      check_in: '',
      check_out: '',
      capacity: '',
      roomSize: '',
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

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setBookingDates({
      check_in: filters.check_in,
      check_out: filters.check_out
    });
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
          payment_status: false,
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
    <div className="container">
      <h2 className="heading">Search and Book Rooms</h2>
      <div className="grid grid-cols-3">
        <div className="form-group">
          <label>Check-In Date</label>
          <input type="date" name="check_in" value={filters.check_in} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label>Check-Out Date</label>
          <input type="date" name="check_out" value={filters.check_out} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label>Capacity</label>
          <select name="capacity" value={filters.capacity} onChange={handleChange} className="input">
            <option value="">Any</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
            <option value="family">Family</option>
          </select>
        </div>
        <div className="form-group">
          <label>Room Size (sqft)</label>
          <input type="number" min="0" name="roomSize" placeholder="e.g., 300" value={filters.roomSize} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label>Hotel Chain</label>
          <select name="hotelChain" value={filters.hotelChain} onChange={handleChange} className="input">
            <option value="">Any</option>
            {hotelChains.map((chain, idx) => (
              <option key={idx} value={chain}>{chain}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Hotel Category</label>
          <select name="hotelCategory" value={filters.hotelCategory} onChange={handleChange} className="input">
            <option value="">Any</option>
            {hotelCategories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Min. Total Rooms</label>
          <input type="number" min="0" name="totalRooms" placeholder="e.g., 50" value={filters.totalRooms} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label>Min Price</label>
          <input type="number" min="0" name="priceMin" placeholder="Min Price" value={filters.priceMin} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label>Max Price</label>
          <input type="number" min="0" name="priceMax" placeholder="Max Price" value={filters.priceMax} onChange={handleChange} className="input" />
        </div>
        <div className="form-group">
          <label>View</label>
          <select name="view" value={filters.view} onChange={handleChange} className="input">
            <option value="">Any View</option>
            <option value="sea">Sea View</option>
            <option value="mountain">Mountain View</option>
          </select>
        </div>
        <div className="form-group">
          <label>Extendable</label>
          <select name="extendable" value={filters.extendable} onChange={handleChange} className="input">
            <option value="">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: '20px', marginBottom: '40px' }}>
        <button className="button" onClick={handleSearch}>Search</button>
        <button className="button" onClick={handleReset} style={{ marginLeft: '10px' }}>Reset</button>
      </div>
      <div className="card">
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
                  <p>Size: {room.roomSize || room.area} sqft</p>
                  <p>Hotel Chain: {room.hotel_chain || 'N/A'}</p>
                  <p>Hotel Category: {room.hotel_category || 'N/A'}</p>
                  <p>Total Rooms: {room.total_rooms || 'N/A'}</p>
                  <p>Price: ${room.price}</p>
                  <p>View: {room.sea_view ? 'Sea View' : room.mountain_view ? 'Mountain View' : 'None'}</p>
                  <p>Extendable: {room.extendable ? 'Yes' : 'No'}</p>
                </div>
                <button className="button" onClick={() => handleBookRoom(room)}>Book Room</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedRoom && (
        <div className="card">
          <h3>Booking Room #{selectedRoom.room_id}</h3>
          <div className="grid grid-cols-3">
            <div className="form-group">
              <label>Check-In Date</label>
              <input type="date" value={bookingDates.check_in} onChange={(e) => setBookingDates({ ...bookingDates, check_in: e.target.value })} className="input" />
            </div>
            <div className="form-group">
              <label>Check-Out Date</label>
              <input type="date" value={bookingDates.check_out} onChange={(e) => setBookingDates({ ...bookingDates, check_out: e.target.value })} className="input" />
            </div>
            <button className="button" onClick={handleConfirmBooking}>Confirm Booking</button>
          </div>
          {confirmation && <p className="confirmation">{confirmation}</p>}
        </div>
      )}
    </div>
  );
};

export default RoomSearch;