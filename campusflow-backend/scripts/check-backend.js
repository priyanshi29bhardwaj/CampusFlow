// Quick diagnostic script to check backend health
require('dotenv').config();
const http = require('http');

async function checkBackend() {
  console.log('🔍 Backend Health Check\n');
  console.log('='.repeat(50));

  // 1. Check environment variables
  console.log('\n1️⃣ Environment Variables:');
  console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');
  console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
  console.log('   PORT:', process.env.PORT || '3001 (default)');

  // 2. Check database connection
  console.log('\n2️⃣ Database Connection:');
  try {
    const db = require('../config/database');
    await db.query('SELECT NOW()');
    console.log('   ✅ Database connected successfully');
    
    // Check tables exist
    const tables = ['users', 'clubs', 'venues', 'events', 'notifications'];
    for (const table of tables) {
      try {
        await db.query(`SELECT 1 FROM ${table} LIMIT 1`);
        console.log(`   ✅ Table "${table}" exists`);
      } catch (err) {
        console.log(`   ❌ Table "${table}" missing or inaccessible`);
      }
    }
  } catch (err) {
    console.log('   ❌ Database connection failed:', err.message);
  }

  // 3. Check if server is running
  console.log('\n3️⃣ Backend Server:');
  const port = process.env.PORT || 3001;
  try {
    await new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: port,
        path: '/api/clubs',
        method: 'GET',
        timeout: 2000
      }, (res) => {
        console.log(`   ✅ Server is running on port ${port}`);
        console.log(`   ✅ Status: ${res.statusCode}`);
        resolve();
      });

      req.on('error', (err) => {
        console.log(`   ❌ Server not running on port ${port}`);
        console.log(`   Error: ${err.message}`);
        console.log('\n   💡 To start the server, run:');
        console.log('   cd campusflow-backend && npm run dev');
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
      console.log(`   ❌ Server check failed: ${err.message}`);
    }
  }

  // 4. Test API endpoints
  console.log('\n4️⃣ API Endpoints:');
  const endpoints = [
    { path: '/api/clubs', method: 'GET', auth: false },
    { path: '/api/events', method: 'GET', auth: false },
    { path: '/api/venues', method: 'GET', auth: false },
    { path: '/api/notifications', method: 'GET', auth: true },
  ];

  for (const endpoint of endpoints) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: port,
          path: endpoint.path,
          method: endpoint.method,
          timeout: 2000,
          headers: endpoint.auth ? { 'Authorization': 'Bearer test' } : {}
        }, (res) => {
          const status = res.statusCode;
          if (status === 200 || status === 401) {
            console.log(`   ✅ ${endpoint.method} ${endpoint.path} - Status: ${status}`);
          } else {
            console.log(`   ⚠️  ${endpoint.method} ${endpoint.path} - Status: ${status}`);
          }
          resolve();
        });

        req.on('error', () => {
          console.log(`   ❌ ${endpoint.method} ${endpoint.path} - Not accessible`);
          resolve();
        });

        req.on('timeout', () => {
          req.destroy();
          resolve();
        });

        req.end();
      });
    } catch (err) {
      // Ignore
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n✅ Health check complete!\n');
}

checkBackend().catch(console.error);

