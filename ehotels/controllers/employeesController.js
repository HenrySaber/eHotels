const pool = require('../db');

// GET all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Employee');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

// POST create employee
exports.createEmployee = async (req, res) => {
  const { employee_ssn, first_name, last_name, address, salary, hotel_id, role_type } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO Employee (employee_ssn, first_name, last_name, address, salary, hotel_id, role_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [employee_ssn, first_name, last_name, address, salary, hotel_id, role_type]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

// PUT update employee
exports.updateEmployee = async (req, res) => {
  const { employee_ssn, first_name, last_name, address, salary, hotel_id, role_type } = req.body;
  const { ssn } = req.params;
  try {
    const result = await pool.query(`
      UPDATE Employee
      SET first_name = $1,
          last_name = $2,
          address = $3,
          salary = $4,
          hotel_id = $5,
          role_type = $6
      WHERE employee_ssn = $7
      RETURNING *;
    `, [first_name, last_name, address, salary, hotel_id, role_type, ssn]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

// DELETE employee
exports.deleteEmployee = async (req, res) => {
  const { ssn } = req.params;
  try {
    await pool.query('DELETE FROM Employee WHERE employee_ssn = $1', [ssn]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};
