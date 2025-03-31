const pool = require('../db');

// GET all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Hotel');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
};

// POST create hotel
exports.createHotel = async (req, res) => {
  const { address, star_rating, name, number_of_rooms, chain_id } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO Hotel (address, star_rating, name, number_of_rooms, chain_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [address, star_rating, name, number_of_rooms, chain_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create hotel' });
  }
};

// PUT update hotel
exports.updateHotel = async (req, res) => {
  const { id } = req.params;
  const { address, star_rating, name, number_of_rooms, chain_id } = req.body;
  try {
    const result = await pool.query(`
      UPDATE Hotel
      SET address = $1,
          star_rating = $2,
          name = $3,
          number_of_rooms = $4,
          chain_id = $5
      WHERE hotel_id = $6
      RETURNING *;
    `, [address, star_rating, name, number_of_rooms, chain_id, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update hotel' });
  }
};

// DELETE hotel
exports.deleteHotel = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Hotel WHERE hotel_id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
};
