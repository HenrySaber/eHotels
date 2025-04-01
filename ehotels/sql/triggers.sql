-- Trigger 1: Ensure guest is registered before making a reservation
CREATE OR REPLACE FUNCTION check_guest_registration()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM Client WHERE NAS = NEW.NAS_client) THEN
    RAISE EXCEPTION 'Client must be registered before making a reservation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_guest_registration
BEFORE INSERT ON Location_reservation
FOR EACH ROW
EXECUTE FUNCTION check_guest_registration();

-- Trigger 2: Auto-assign manager if hotel doesn’t have one
CREATE OR REPLACE FUNCTION assign_manager()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'manager' THEN
    IF EXISTS (
      SELECT 1 FROM Employe WHERE id_hotel = NEW.id_hotel AND type = 'manager'
    ) THEN
      RAISE EXCEPTION 'This hotel already has a manager';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assign_manager
BEFORE INSERT ON Employe
FOR EACH ROW
EXECUTE FUNCTION assign_manager();

CREATE OR REPLACE FUNCTION update_room_count_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE Hotel
  SET number_of_rooms = number_of_rooms + 1
  WHERE hotel_id = NEW.hotel_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_room_insert
AFTER INSERT ON Room
FOR EACH ROW
EXECUTE FUNCTION update_room_count_on_insert();

CREATE OR REPLACE FUNCTION prevent_late_guest_reservation()
RETURNS TRIGGER AS $$
DECLARE
  reg_date DATE;
BEGIN
  SELECT registration_date INTO reg_date FROM Guest WHERE guest_ssn = NEW.guest_ssn;

  IF reg_date IS NULL OR reg_date > NEW.check_in_date THEN
    RAISE EXCEPTION 'Guest must be registered before making a reservation';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_late_guest
BEFORE INSERT ON Reservation
FOR EACH ROW
EXECUTE FUNCTION prevent_late_guest_reservation();
