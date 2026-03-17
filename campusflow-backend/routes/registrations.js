// routes/registrations.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/database');

router.get('/my', auth, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM event_registrations WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json(rows);
});

router.post('/', auth, async (req, res) => {
  try {
    const { event_id } = req.body
    const userId = req.user.id

    await db.query(
      `INSERT INTO event_registrations (user_id, event_id)
       VALUES ($1,$2)`,
      [userId, event_id]
    )

    res.json({
      message: "registered_successfully"
    })

  } catch (error) {

    console.error("DB ERROR:", error) // debug

    // 🔥 THIS IS THE KEY FIX
    if (error.code === '23505') {
      return res.status(400).json({
        message: "already_registered"
      })
    }

    res.status(500).json({
      message: "server_error"
    })
  }
})

module.exports = router;