const pool = require('../db');

// GET all guests
exports.getAllGuests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Client');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch guests" });
  }
};

// POST create a guest
exports.createGuest = async (req, res) => {
  const { guest_ssn, first_name, last_name, address } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO guest (guest_ssn, first_name, last_name, address, registration_date)
      VALUES ($1, $2, $3, $4, CURRENT_DATE)
      RETURNING *;
    `, [guest_ssn, first_name, last_name, address]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create guest' });
  }
};

// PUT update a guest
exports.updateGuest = async (req, res) => {
  const { guest_ssn } = req.params;
  const { first_name, last_name,address } = req.body;
  try {
    const result = await pool.query(`
      UPDATE guest
      SET first_name = $1, last_name = $2, address = $3
      WHERE guest_ssn = $4
      RETURNING *;
    `, [first_name, last_name, address, guest_ssn]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update guest' });
  }
};

// DELETE guest
exports.deleteGuest = async (req, res) => {
  const { guest_ssn } = req.params;
  try {
    await pool.query('DELETE FROM Client WHERE guest_ssn = $1', [guest_ssn]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete guest' });
  }
};
