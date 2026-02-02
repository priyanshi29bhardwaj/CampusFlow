require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    console.error('   Please create a .env file with: DATABASE_URL=postgres://user:pass@host:5432/dbname');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to database');

    console.log('🔄 Reading schema.sql...');
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    console.log('🔄 Creating tables...');
    await pool.query(schemaSQL);
    console.log('✅ Database schema initialized successfully!');
    console.log('   Tables created: users, clubs, venues, events, venue_bookings, event_registrations, proposal_letters, notifications');
    console.log('   Venues seeded: SHARDA PAI AUDITORIUM, VASANTI PAI AUDITORIUM, TMA PAI AUDITORIUM');

    // Ensure btree_gist extension and exclusion constraint for non-overlapping bookings
    console.log('🔄 Ensuring btree_gist extension...');
    await pool.query(`CREATE EXTENSION IF NOT EXISTS btree_gist;`);

    console.log('🔄 Ensuring exclusion constraint on venue_bookings (no overlapping bookings per venue)...');
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'no_overlapping_bookings_per_venue'
        ) THEN
          ALTER TABLE venue_bookings
          ADD CONSTRAINT no_overlapping_bookings_per_venue
          EXCLUDE USING gist (
            venue_id WITH =,
            tstzrange(booked_start, booked_end, '[)') WITH &&
          );
        END IF;
      END
      $$;
    `);
    console.log('✅ Non-overlap constraint ensured.');

    await pool.end();
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();

