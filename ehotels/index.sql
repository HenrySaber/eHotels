-- Index 1: Make searching rooms by hotel faster
CREATE INDEX idx_room_hotel_id ON room(hotel_id);
/* Used in many queries filtering rooms by hotel. Speeds up availability searches. */

-- Index 2: Improve guest reservation lookups
CREATE INDEX idx_reservation_guest_date ON reservation(guest_id, start_date);
/* Useful for tracking a guest’s bookings, especially when sorted by date. */

-- Index 3: Fast role-based employee filtering
CREATE INDEX idx_employee_role ON employee(role);
/* Helpful for quickly finding all managers or staff, e.g., assigning tasks. */