// routes/registrations.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');

router.get('/my', auth, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM event_registrations WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});

module.exports = router;
