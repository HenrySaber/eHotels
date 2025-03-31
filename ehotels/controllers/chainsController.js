const pool = require('../db');

// GET all hotel chains
exports.getAllChains = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM HotelChainOffice');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotel chains' });
  }
};

// POST create hotel chain
exports.createChain = async (req, res) => {
  const { chain_name, address, number_of_hotels } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO HotelChainOffice (chain_name, address, number_of_hotels)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [chain_name, address, number_of_hotels]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create hotel chain' });
  }
};

// PUT update chain
exports.updateChain = async (req, res) => {
  const { id } = req.params;
  const { chain_name, address, number_of_hotels } = req.body;
  try {
    const result = await pool.query(`
      UPDATE HotelChainOffice
      SET chain_name = $1,
          address = $2,
          number_of_hotels = $3
      WHERE chain_id = $4
      RETURNING *;
    `, [chain_name, address, number_of_hotels, id]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update hotel chain' });
  }
};

// DELETE hotel chain
exports.deleteChain = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM HotelChainOffice WHERE chain_id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hotel chain' });
  }
};
