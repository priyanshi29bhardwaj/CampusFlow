// controllers/clubController.js
const db = require('../config/database');

exports.listClubs = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM clubs ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getClub = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM clubs WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Club not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

