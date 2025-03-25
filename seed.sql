-- Drop all tables in correct dependency order
DROP TABLE IF EXISTS Reservation, Guest, Employee, Room, Amenity, Problem, Role,
HotelPhone, HotelEmail, Hotel, ChainPhone, ChainEmail, HotelChainOffice CASCADE;

-- Hotel Chain Headquarters
CREATE TABLE HotelChainOffice (
    chain_id SERIAL PRIMARY KEY,
    chain_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    number_of_hotels INT CHECK (number_of_hotels > 0)
);

-- Email addresses for hotel chains
CREATE TABLE ChainEmail (
    email_id SERIAL PRIMARY KEY,
    email_address VARCHAR(100) NOT NULL,
    chain_id INT REFERENCES HotelChainOffice(chain_id) ON DELETE CASCADE
);

-- Phone numbers for hotel chains
CREATE TABLE ChainPhone (
    phone_number VARCHAR(20) PRIMARY KEY,
    chain_id INT REFERENCES HotelChainOffice(chain_id) ON DELETE CASCADE
);

-- Hotel
CREATE TABLE Hotel (
    hotel_id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    name VARCHAR(100) NOT NULL,
    number_of_rooms INT CHECK (number_of_rooms > 0),
    chain_id INT REFERENCES HotelChainOffice(chain_id) ON DELETE SET NULL
);

-- Email addresses for hotels
CREATE TABLE HotelEmail (
    email_address VARCHAR(100) PRIMARY KEY,
    hotel_id INT REFERENCES Hotel(hotel_id) ON DELETE CASCADE
);

-- Phone numbers for hotels
CREATE TABLE HotelPhone (
    phone_number VARCHAR(20) PRIMARY KEY,
    hotel_id INT REFERENCES Hotel(hotel_id) ON DELETE CASCADE
);

-- Roles
CREATE TABLE Role (
    role_type VARCHAR(50) PRIMARY KEY,
    description TEXT NOT NULL
);

-- Room Issues
CREATE TABLE Problem (
    problem_id SERIAL PRIMARY KEY,
    date DATE,
    resolution TEXT,
    description TEXT
);

-- Room Amenities
CREATE TABLE Amenity (
    amenity_id SERIAL PRIMARY KEY,
    description TEXT NOT NULL
);

-- Hotel Room
CREATE TABLE Room (
    room_id SERIAL PRIMARY KEY,
    price DECIMAL(10, 2) CHECK (price > 0),
    capacity VARCHAR(20) CHECK (capacity IN ('single', 'double', 'suite', 'family')),
    mountain_view BOOLEAN NOT NULL,
    sea_view BOOLEAN NOT NULL,
    extendable BOOLEAN DEFAULT FALSE,
    area INT,
    problem_id INT REFERENCES Problem(problem_id) ON DELETE SET NULL,
    amenity_id INT REFERENCES Amenity(amenity_id) ON DELETE SET NULL,
    hotel_id INT REFERENCES Hotel(hotel_id) ON DELETE CASCADE,
    damages TEXT
);

-- Hotel Employee
CREATE TABLE Employee (
    employee_ssn VARCHAR(15) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    salary DECIMAL(10,2) CHECK (salary > 0),
    hotel_id INT REFERENCES Hotel(hotel_id) ON DELETE SET NULL,
    reservation_id INT,
    role_type VARCHAR(50),
    FOREIGN KEY (role_type) REFERENCES Role(role_type)
);

-- Hotel Guest
CREATE TABLE Guest (
    guest_ssn VARCHAR(15) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    registration_date DATE NOT NULL,
    employee_ssn VARCHAR(15),
    reservation_id INT,
    FOREIGN KEY (employee_ssn) REFERENCES Employee(employee_ssn)
);

-- Reservation
CREATE TABLE Reservation (
    reservation_id SERIAL PRIMARY KEY,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    payment_status BOOLEAN DEFAULT FALSE,
    room_id INT REFERENCES Room(room_id) ON DELETE SET NULL,
    guest_ssn VARCHAR(15),
    employee_ssn VARCHAR(15),
    FOREIGN KEY (guest_ssn) REFERENCES Guest(guest_ssn),
    FOREIGN KEY (employee_ssn) REFERENCES Employee(employee_ssn),
    CHECK (check_in_date < check_out_date)
);

