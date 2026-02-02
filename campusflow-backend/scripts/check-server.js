// Quick script to check if server is running and database is connected
require('dotenv').config();

async function checkServer() {
  console.log('🔍 Checking server status...\n');

  // Check database
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    await pool.query('SELECT NOW()');
    console.log('✅ Database: Connected');
    await pool.end();
  } catch (err) {
    console.error('❌ Database: Connection failed');
    console.error('   Error:', err.message);
    return;
  }

  // Check if server is running
  try {
    const http = require('http');
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/clubs',
      method: 'GET',
      timeout: 2000
    };

    await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        console.log('✅ Backend Server: Running on port 3001');
        console.log('   Status:', res.statusCode);
        resolve();
      });

      req.on('error', (err) => {
        console.error('❌ Backend Server: Not running');
        console.error('   Error:', err.message);
        console.error('\n   To start the server, run:');
        console.error('   cd campusflow-backend && npm run dev');
        reject(err);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Connection timeout'));
      });

      req.end();
    });
  } catch (err) {
    if (err.message !== 'Connection timeout') {
      console.error('❌ Backend Server: Not accessible');
    }
  }

  console.log('\n📋 Environment Check:');
  console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('   PORT:', process.env.PORT || '3001 (default)');
}

checkServer().catch(console.error);

