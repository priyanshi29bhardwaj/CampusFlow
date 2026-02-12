// routes/registrations.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');

/*
=========================
REGISTER FOR EVENT
=========================
*/
router.post('/', auth, async (req, res) => {
  try {
    const { event_id } = req.body;

    if (!event_id) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    await db.query(
      `INSERT INTO event_registrations (event_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (event_id, user_id) DO NOTHING`,
      [event_id, req.user.id]
    );

    res.json({ message: 'Registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

/*
=========================
GET MY REGISTRATIONS
=========================
*/
router.get('/my', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM event_registrations
       WHERE user_id=$1
       ORDER BY registered_at DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

module.exports = router;
