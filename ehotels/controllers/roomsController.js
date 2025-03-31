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
    res.status(500).json({ error: 'Failed to delete room' });
  }
};
