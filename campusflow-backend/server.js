require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// 🧩 Middleware
app.use(cors());
app.use(express.json());

// 🔐 Env sanity checks
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set. Auth endpoints will fail until it is configured.');
}
if (!process.env.JWT_EXPIRY) {
  console.warn('⚠️  JWT_EXPIRY is not set. Defaulting to 7d for tokens.');
  process.env.JWT_EXPIRY = '7d';
}

// 🧠 Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/venues', require('./routes/venues'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/proposals', require('./routes/proposals'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));


// 🚀 Start the server
const PORT = process.env.PORT || 3001;

// Test database connection on startup
const db = require('./config/database');
(async () => {
  try {
    await db.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL Database');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Please check your DATABASE_URL in .env file');
    process.exit(1);
  }
})();

app.listen(PORT, () => {
  console.log(`✅ CAMPUSFLOW backend running on port ${PORT}`);
  console.log(`   API available at http://localhost:${PORT}/api`);
});
