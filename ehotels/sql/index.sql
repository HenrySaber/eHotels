-- Index 1: Make searching rooms by hotel faster
CREATE INDEX idx_room_hotel_id ON room(hotel_id);
/* Used in many queries filtering rooms by hotel. Speeds up availability searches. 
This index improves the performance of queries that retrieve all rooms associated with a specific hotel. 
In hotel management systems, this is a very common operation — for example, when checking room availability,
managing bookings, or displaying room lists in an admin panel.

Without the index, the database would need to perform a full table scan of the room table every time it filters by hotel_id, 
which becomes inefficient as the number of rooms grows. With this index, the database can quickly locate only the 
rows that match the hotel, resulting in much faster query execution, especially when there are thousands of room entries.*/

-- Index 2: Improve guest reservation lookups
CREATE INDEX idx_reservation_guest_date ON reservation(guest_id, start_date);
/* Useful for tracking a guest’s bookings, especially when sorted by date. 
Having both guest_id and start_date indexed allows the database to filter and sort in one pass, 
without needing to scan or sort all reservations manually.
This is especially useful in user dashboards, customer service tools, or reporting features.*/

-- Index 3: Fast role-based employee filtering
CREATE INDEX idx_employee_role ON employee(role);
/* Helpful for quickly finding all managers or staff, e.g., assigning tasks. 
This index is useful for queries that filter employees based on their role — for example, to find all managers, 
receptionists, or maintenance staff. Such queries are common in systems that assign tasks, manage schedules, or 
apply role-based access controls.

Since roles typically have a limited set of repeated values (low cardinality), the index is compact and efficient.
It allows the database to quickly return only the employees matching a given role without scanning the entire employee table, 
improving performance for operational queries and administrative functions.*/