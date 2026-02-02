require('dotenv').config();
const { Pool } = require('pg');

async function addConstraints() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to database');

    console.log('🔄 Enabling btree_gist extension (if not exists)...');
    await pool.query(`CREATE EXTENSION IF NOT EXISTS btree_gist;`);

    console.log('🔄 Adding exclusion constraint to prevent overlapping bookings per venue...');
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

    console.log('✅ Constraint added (or already present).');
    await pool.end();
  } catch (err) {
    console.error('❌ Error adding constraints:', err.message);
    await pool.end();
    process.exit(1);
  }
}

addConstraints();


