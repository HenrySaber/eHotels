const pool = require('../db');

// GET: Available rooms per area
// GET: /api/views/available-rooms-zone?zone=Rainford%20Vancouver
exports.getAvailableRoomsPerArea = async (req, res) => {
    const { zone } = req.query;
    try {
      const baseQuery = 'SELECT * FROM available_rooms_zone';
      const query = zone ? `${baseQuery} WHERE zone = $1` : baseQuery;
      const params = zone ? [zone] : [];
  
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching zone stats:', err);
      res.status(500).json({ error: 'Failed to fetch zone stats' });
    }
  };
  

// GET: Room capacity by hotel
exports.getRoomCapacityByHotel = async (req, res) => {
  const { hotel_id } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM RoomCapacityByHotel WHERE hotel_id = $1',
      [hotel_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching room capacity:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
