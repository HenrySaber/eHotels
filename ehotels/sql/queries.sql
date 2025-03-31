-- 1. Find available rooms by hotel zone and date
SELECT * FROM Chambre c
WHERE id_chambre NOT IN (
  SELECT id_chambre FROM Location_reservation
  WHERE date_check_in <= CURRENT_DATE AND date_check_out >= CURRENT_DATE
);

-- 2. Count available rooms by zone
CREATE OR REPLACE VIEW chambres_disponibles_par_zone AS
SELECT h.adresse AS zone, COUNT(c.id_chambre) AS chambres_disponibles
FROM Hotel h
JOIN Chambre c ON h.id_hotel = c.id_chambre
LEFT JOIN Location_reservation lr ON c.id_chambre = lr.id_chambre
  AND CURRENT_DATE BETWEEN lr.date_check_in AND lr.date_check_out
WHERE lr.id_chambre IS NULL
GROUP BY h.adresse;

-- 3. Total bookings per client
SELECT NAS_client, COUNT(*) AS total_reservations
FROM Location_reservation
GROUP BY NAS_client;

-- 4. Hotel occupancy rate
SELECT h.nom, 
  COUNT(lr.id_chambre)::float / h.nombre_de_chambres * 100 AS taux_occupation
FROM Hotel h
LEFT JOIN Location_reservation lr ON h.id_hotel = lr.id_chambre
GROUP BY h.nom, h.nombre_de_chambres;
