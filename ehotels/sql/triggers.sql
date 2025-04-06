-- This ensures a reservation can't be created unless the guest exists
CREATE OR REPLACE FUNCTION check_guest_exists()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM Guest WHERE guest_ssn = NEW.guest_ssn
  ) THEN
    RAISE EXCEPTION 'Guest must be registered before making a reservation.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_guest_exists
BEFORE INSERT ON Reservation
FOR EACH ROW
EXECUTE FUNCTION check_guest_exists();

-- Only one manager per hotel is allowed
CREATE OR REPLACE FUNCTION prevent_multiple_managers()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role_type = 'manager' THEN
    IF EXISTS (
      SELECT 1 FROM Employee WHERE hotel_id = NEW.hotel_id AND role_type = 'manager'
    ) THEN
      RAISE EXCEPTION 'This hotel already has a manager assigned.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_multiple_managers
BEFORE INSERT ON Employee
FOR EACH ROW
EXECUTE FUNCTION prevent_multiple_managers();


-- Updates hotel room count upon new room insertion
CREATE OR REPLACE FUNCTION update_room_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE Hotel
  SET number_of_rooms = number_of_rooms + 1
  WHERE hotel_id = NEW.hotel_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_room_count
AFTER INSERT ON Room
FOR EACH ROW
EXECUTE FUNCTION update_room_count();
