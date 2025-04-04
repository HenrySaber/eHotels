const pool = require('../db');

// GET all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Room');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

// GET available rooms with filters
exports.getAvailableRooms = async (req, res) => {
  try {
    const {
      capacity,
      area,
      hotelChain,
      hotelCategory,
      totalRooms,
      priceMin,
      priceMax,
      view,
      extendable
    } = req.query;

    let query = `
    SELECT r.*, h.name AS hotel_name, h.star_rating, h.number_of_rooms, c.chain_name, c.chain_id
      FROM Room r
      JOIN Hotel h ON r.hotel_id = h.hotel_id
      JOIN hotelchainoffice c ON h.chain_id = c.chain_id
      WHERE 1=1
    `;

    const params = [];
    let i = 1;

    if (capacity) {
      query += ` AND r.capacity = $${i++}`;
      params.push(capacity);
    }
    if (area) {
      query += ` AND r.area >= $${i++}`;
      params.push(parseInt(area));
    }
    if (hotelChain) {
      query += ` AND c.chain_name ILIKE $${i++}`;
      params.push(`%${hotelChain}%`);
    }
    if (hotelCategory) {
      const star = parseInt(hotelCategory[0]); // from "3 Star" get 3
      query += ` AND h.star_rating = $${i++}`;
      params.push(star);
    }
    if (totalRooms) {
      query += ` AND h.number_of_rooms >= $${i++}`;
      params.push(parseInt(totalRooms));
    }
    if (priceMin) {
      query += ` AND r.price >= $${i++}`;
      params.push(parseFloat(priceMin));
    }
    if (priceMax) {
      query += ` AND r.price <= $${i++}`;
      params.push(parseFloat(priceMax));
    }
    if (view === 'sea') {
      query += ` AND r.sea_view = true`;
    }
    if (view === 'mountain') {
      query += ` AND r.mountain_view = true`;
    }
    if (extendable === 'yes') {
      query += ` AND r.extendable = true`;
    }
    if (extendable === 'no') {
      query += ` AND r.extendable = false`;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch available rooms' });
  }
};

// POST create a room
exports.createRoom = async (req, res) => {
  const {
    price,
    capacity,
    mountain_view,
    sea_view,
    extendable,
    area,
    problem_id,
    amenity_id,
    hotel_id,
    damages
  } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO Room (price, capacity, mountain_view, sea_view, extendable, area, problem_id, amenity_id, hotel_id, damages)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `, [price, capacity, mountain_view, sea_view, extendable, area, problem_id, amenity_id, hotel_id, damages]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// PUT update room
exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const {
    price,
    capacity,
    mountain_view,
    sea_view,
    extendable,
    area,
    problem_id,
    amenity_id,
    hotel_id,
    damages
  } = req.body;

  try {
    const result = await pool.query(`
      UPDATE Room
      SET price = $1,
          capacity = $2,
          mountain_view = $3,
          sea_view = $4,
          extendable = $5,
          area = $6,
          problem_id = $7,
          amenity_id = $8,
          hotel_id = $9,
          damages = $10
      WHERE room_id = $11
      RETURNING *;
    `, [price, capacity, mountain_view, sea_view, extendable, area, problem_id, amenity_id, hotel_id, damages, id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update room' });
  }
};

// DELETE room
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Room WHERE room_id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};
