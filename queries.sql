-- Query 1: Detect Overbooked Rooms 
SELECT r1.room_id, r1.check_in_date, r1.check_out_date, r2.check_in_date AS overlapping_checkin, r2.check_out_date AS overlapping_checkout
FROM Reservation r1
JOIN Reservation r2 ON r1.room_id = r2.room_id
  AND r1.reservation_id <> r2.reservation_id
  AND (r1.check_in_date, r1.check_out_date) OVERLAPS (r2.check_in_date, r2.check_out_date)
ORDER BY r1.room_id;


-- Query 2: Rooms With Invalid Capacity Type
-- Finds rooms with capacity values outside the allowed set: 'single', 'double', 'suite', 'family'.
SELECT *
FROM Room
WHERE capacity NOT IN ('single', 'double', 'suite', 'family');

-- Query 3: Employees Assigned Roles Not in the Role Table
-- Validates that all employees have valid roles that exist in the Role table.
SELECT e.*
FROM Employee e
LEFT JOIN Role r ON e.role_type = r.role_type
WHERE e.role_type IS NOT NULL AND r.role_type IS NULL;


-- Query 4: Number of Available Rooms per Hotel
-- This query returns all rooms not currently reserved (NOT IN subquery).
SELECT 
  h.hotel_id,
  h.name AS hotel_name,
  COUNT(r.room_id) AS available_rooms
FROM hotel h
JOIN room r ON h.hotel_id = r.hotel_id
WHERE r.room_id NOT IN (
  SELECT room_id
  FROM reservation
  WHERE CURRENT_DATE BETWEEN check_in_date AND check_out_date
)
GROUP BY h.hotel_id, h.name
ORDER BY available_rooms DESC;
