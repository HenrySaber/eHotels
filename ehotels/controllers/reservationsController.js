const pool = require('../db');

// GET all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reservation');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

// POST create a reservation with overlap check
exports.createReservation = async (req, res) => {
  const { check_in_date, check_out_date, payment_status, room_id, guest_ssn, employee_ssn } = req.body;

  // 🛑 Validate incoming values
  if (!check_in_date || !check_out_date || !room_id || !guest_ssn) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // ✅ Check guest exists
    const guestCheck = await pool.query(
      'SELECT * FROM guest WHERE guest_ssn = $1',
      [guest_ssn]
    );

    if (guestCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Guest SSN does not exist in the system' });
    }

    // ✅ Check for conflicting reservations
    const conflictCheck = await pool.query(
      `
        SELECT * FROM reservation
        WHERE room_id = $1
        AND NOT (
          $2 >= check_out_date OR $3 <= check_in_date
        )
      `,
      [room_id, check_in_date, check_out_date]
    );

    if (conflictCheck.rows.length > 0) {
      return res.status(409).json({
        error: 'Room is already reserved for the selected date range.'
      });
    }

    // ✅ Insert new reservation
    const result = await pool.query(
      `
        INSERT INTO reservation (check_in_date, check_out_date, payment_status, room_id, guest_ssn, employee_ssn)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `,
      [check_in_date, check_out_date, payment_status || false, room_id, guest_ssn, employee_ssn || null]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

// PUT update reservation
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const { check_in_date, check_out_date, payment_status, room_id, guest_ssn, employee_ssn } = req.body;

  try {
    const result = await pool.query(
      `
        UPDATE reservation
        SET check_in_date = $1,
            check_out_date = $2,
            payment_status = $3,
            room_id = $4,
            guest_ssn = $5,
            employee_ssn = $6
        WHERE reservation_id = $7
        RETURNING *;
      `,
      [check_in_date, check_out_date, payment_status, room_id, guest_ssn, employee_ssn, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error('Error updating reservation:', err);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
};

// DELETE reservation
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM reservation WHERE reservation_id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting reservation:', err);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};
