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
      return res.status(400).json({ message: 'Event ID is required' });
    }

    await db.query(
      `INSERT INTO event_registrations (event_id, user_id)
       VALUES ($1, $2)`,
      [event_id, req.user.id]
    );

    res.json({ message: 'registered_successfully' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'already_registered' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'server_error' });
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
