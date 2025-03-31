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
