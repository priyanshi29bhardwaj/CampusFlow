// Quick test script for signup endpoint
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

async function testSignup() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected');

    const testEmail = 'test@example.com';
    const testPassword = 'test123456';
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    console.log('Testing user insertion...');
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, registration_number, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, first_name, last_name, role`,
      ['test@example.com', hashedPassword, 'Test', 'User', 'TEST123', 'student']
    );

    console.log('✅ User created successfully:', result.rows[0]);

    // Clean up
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
    console.log('✅ Test user deleted');

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error detail:', error.detail);
    await pool.end();
    process.exit(1);
  }
}

testSignup();

