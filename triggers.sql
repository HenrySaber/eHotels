-- Trigger 1:  Prevent Overlapping Reservations on Same Room
--Automatically blocks double-bookings for the same room.

-- Function to check overlapping reservations
CREATE OR REPLACE FUNCTION prevent_double_booking()
RETURNS TRIGGER AS $$
DECLARE
  conflict_count INT;
BEGIN
  SELECT COUNT(*)
  INTO conflict_count
  FROM reservation
  WHERE room_id = NEW.room_id
    AND reservation_id != COALESCE(NEW.reservation_id, -1)
    AND (check_in_date, check_out_date) OVERLAPS (NEW.check_in_date, NEW.check_out_date);

  IF conflict_count > 0 THEN
    RAISE EXCEPTION 'This room is already reserved for that time period.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on Reservation table
DROP TRIGGER IF EXISTS trg_prevent_double_booking ON reservation;

CREATE TRIGGER trg_prevent_double_booking
BEFORE INSERT OR UPDATE ON reservation
FOR EACH ROW
EXECUTE FUNCTION prevent_double_booking();




-- Trigger 2: Prevent Employees With Invalid Salary 
-- Ensures salary is greater than 0 — enforcing your business logic

-- Step 1: Create the validation function
CREATE OR REPLACE FUNCTION validate_employee_salary()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.salary <= 0 THEN
    RAISE EXCEPTION 'Employee salary must be a positive number.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Bind to the Employee table
DROP TRIGGER IF EXISTS trg_validate_employee_salary ON employee;

CREATE TRIGGER trg_validate_employee_salary
BEFORE INSERT OR UPDATE ON employee
FOR EACH ROW
EXECUTE FUNCTION validate_employee_salary();
