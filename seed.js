const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'ehotels',
  password: 'postgres',
  port: 5432,
});

const chains = [
  { name: 'Evergreen Hospitality', address: '10 Spruce Valley Rd', email: 'hq@evergreen.com', phone: '431-111-2233' },
  { name: 'Crystal Nest Group', address: '87 Moonbeam Ln', email: 'contact@crystalnest.com', phone: '587-999-7821' },
  { name: 'BlueNova Resorts', address: '1210 Oceancrest Ave', email: 'info@bluenova.com', phone: '613-873-3049' },
  { name: 'MapleLux Collection', address: '443 Northern Lights St', email: 'hq@maplelux.ca', phone: '705-610-3322' },
  { name: 'Cedar & Stone Inns', address: '77 Pinebridge Crescent', email: 'admin@cedarstone.ca', phone: '289-720-4488' }
];

const hotelZones = [
  'Riverside Ottawa', 'Highland Montreal', 'Aurora Toronto', 'Beacon Quebec', 'Rainford Vancouver'
];

const ratings = [1, 2, 3, 4, 5];
const capacities = ['single', 'double', 'suite', 'family'];

const damageSamples = [
  'Loose door handle', 'AC unit rattling', 'Water stain on ceiling',
  'Cracked bathroom tile', 'Scratched wardrobe'
];

const staffNames = [
  'Nora Bishop', 'Miles Archer', 'Elena Brooks', 'Julian Chen', 'Camila Reyes',
  'Owen Patel', 'Harper Lin', 'Liam Tran', 'Chloe Fox', 'Ethan Rivers',
  'Zara Bennett', 'Leo Hart', 'Ava Simmons', 'Grayson Wood', 'Isla Clarke',
  'Mason Wolfe', 'Luna Ortiz', 'Ezra Ford', 'Layla Monroe', 'Kai Silva',
  'Vivian Cross', 'Dylan Knox', 'Tessa Blair', 'Asher Ray', 'Riley Quinn'
];

const guestData = [
  ['Finn', 'Carter', '32 Elmstone Ave', '921-341-000'],
  ['Lena', 'Walters', '8 Timberlake Crescent', '892-764-112'],
  ['Julio', 'Montoya', '121 Harvest Way', '873-621-459'],
  ['Amara', 'Hill', '67 Bayridge Dr', '800-112-990'],
  ['Theo', 'Ramsey', '400 Redwood Loop', '789-454-887']
];

(async () => {
  try {
    await client.connect();

    // Reset all relevant tables
    await client.query(`
      TRUNCATE Reservation, Guest, Employee, Room, Hotel, HotelPhone, HotelEmail, HotelChainOffice, ChainPhone, ChainEmail, Role RESTART IDENTITY CASCADE;
    `);
    console.log("✅ Tables reset.");

    // 1. Hotel Chains
    console.log("Seeding Hotel Chains...");
    for (const chain of chains) {
      const res = await client.query(`
        INSERT INTO HotelChainOffice (chain_name, address, number_of_hotels)
        VALUES ($1, $2, $3) RETURNING chain_id
      `, [chain.name, chain.address, 8]);
      const chainId = res.rows[0].chain_id;

      await client.query(`INSERT INTO ChainEmail (email_address, chain_id) VALUES ($1, $2)`, [chain.email, chainId]);
      await client.query(`INSERT INTO ChainPhone (phone_number, chain_id) VALUES ($1, $2)`, [chain.phone, chainId]);
    }

    // 2. Hotels
    console.log("Seeding Hotels...");
    let hotelCounter = 1;
    for (let i = 0; i < chains.length; i++) {
      for (let j = 0; j < 8; j++) {
        const address = `${hotelZones[j % hotelZones.length]} - ${chains[i].name.split(' ')[0]} Branch ${j + 1}`;
        const email = `branch${hotelCounter}@${chains[i].name.split(' ')[0].toLowerCase()}.com`;
        const phone = `613-420-${1000 + hotelCounter}`;
        const rating = ratings[j % ratings.length];

        const hotelRes = await client.query(`
          INSERT INTO Hotel (chain_id, address, star_rating, name, number_of_rooms)
          VALUES ($1, $2, $3, $4, $5) RETURNING hotel_id
        `, [i + 1, address, rating, `${chains[i].name} - Branch ${j + 1}`, 5]);

        const hotelId = hotelRes.rows[0].hotel_id;

        await client.query(`INSERT INTO HotelEmail (email_address, hotel_id) VALUES ($1, $2)`, [email, hotelId]);
        await client.query(`INSERT INTO HotelPhone (phone_number, hotel_id) VALUES ($1, $2)`, [phone, hotelId]);

        hotelCounter++;
      }
    }

    // 3. Rooms
    console.log("Seeding Rooms...");
    for (let hotelId = 1; hotelId <= 40; hotelId++) {
      for (let r = 0; r < 5; r++) {
        const price = 90 + Math.floor(Math.random() * 120);
        const area = 22 + r * 4;
        const sea = r % 2 === 0;
        const mountain = r % 3 === 0;
        const extendable = r % 2 !== 0;
        const damages = r === 2 ? damageSamples[hotelId % damageSamples.length] : null;
        const capacity = capacities[r % capacities.length];

        await client.query(`
          INSERT INTO Room (hotel_id, price, capacity, area, sea_view, mountain_view, extendable, damages)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [hotelId, price, capacity, area, sea, mountain, extendable, damages]);
      }
    }

    // 4. Roles (this is the fix!)
    console.log("Seeding Roles...");
    await client.query(`
      INSERT INTO Role (role_type, description) VALUES
      ('manager', 'Oversees hotel operations'),
      ('staff', 'General support staff');
    `);

    // 5. Employees
    console.log("Seeding Employees...");
    let empIndex = 0;
    for (let hotelId = 1; hotelId <= 40; hotelId++) {
      const [firstM, lastM] = staffNames[empIndex++ % staffNames.length].split(' ');
      await client.query(`
        INSERT INTO Employee (hotel_id, first_name, last_name, address, employee_ssn, salary, role_type)
        VALUES ($1, $2, $3, $4, $5, 50000, 'manager')
      `, [hotelId, firstM, lastM, `Manager House #${hotelId}`, `EMP-${hotelId}-MGR`]);

      const staffCount = 3 + Math.floor(Math.random() * 3); // 3 to 5 staff
      for (let s = 0; s < staffCount; s++) {
        const [firstS, lastS] = staffNames[empIndex++ % staffNames.length].split(' ');
        await client.query(`
          INSERT INTO Employee (hotel_id, first_name, last_name, address, employee_ssn, salary, role_type)
          VALUES ($1, $2, $3, $4, $5, 30000, 'staff')
        `, [hotelId, firstS, lastS, `Staff Unit ${hotelId}-${s}`, `EMP-${hotelId}-S${s}`]);
      }
    }

    // 6. Guests
    console.log("Seeding Guests...");
    for (const [first, last, address, ssn] of guestData) {
      await client.query(`
        INSERT INTO Guest (first_name, last_name, address, guest_ssn, registration_date)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)
      `, [first, last, address, ssn]);
    }

    // 7. Reservation
    console.log("Seeding Reservation...");
    await client.query(`
      INSERT INTO Reservation (check_in_date, check_out_date, payment_status, room_id, guest_ssn, employee_ssn)
      VALUES (CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', TRUE, 1, '921-341-000', 'EMP-1-MGR')
    `);

    console.log("🎉 Done seeding everything!");
    await client.end();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    await client.end();
  }
})();
