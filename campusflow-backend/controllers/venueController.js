// controllers/venueController.js
const db = require('../config/database');

exports.listVenues = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM venues ORDER BY name');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Check availability by passing start & end timestamps as query params
exports.checkAvailability = async (req, res) => {
  try {
    const venueId = req.params.id;
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: 'start and end required' });

    const q = `
      SELECT * FROM venue_bookings
      WHERE venue_id=$1
        AND NOT (booked_end <= $2 OR booked_start >= $3)
      ORDER BY booked_start
    `;
    const { rows } = await db.query(q, [venueId, start, end]);
    res.json({ conflicts: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.bookVenue = async (req, res) => {
  try {
    const venueId = req.params.id;
    const { bookedStart, bookedEnd, expectedAttendees, specialRequirements } = req.body;

    // Validate
    if (!bookedStart || !bookedEnd) {
      return res.status(400).json({ error: 'bookedStart and bookedEnd are required' });
    }
    const start = new Date(bookedStart);
    const end = new Date(bookedEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid bookedStart/bookedEnd' });
    }
    if (start >= end) {
      return res.status(400).json({ error: 'bookedStart must be before bookedEnd' });
    }
    if (!req.user?.clubId) {
      return res.status(403).json({ error: 'Your account is not associated with a club. Contact admin.' });
    }

    // check conflicts
    const conflictQuery = `
      SELECT * FROM venue_bookings
      WHERE venue_id=$1
        AND NOT (booked_end <= $2 OR booked_start >= $3)
    `;
    const conflicts = await db.query(conflictQuery, [venueId, bookedStart, bookedEnd]);
    if (conflicts.rows.length > 0) return res.status(400).json({ error: 'Venue already booked', conflicts: conflicts.rows });

    const insertQ = `INSERT INTO venue_bookings (venue_id, club_id, booked_start, booked_end, expected_attendees, special_requirements, created_by, status)
                     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const values = [venueId, req.user.clubId, bookedStart, bookedEnd, expectedAttendees, specialRequirements, req.user.id, 'pending'];
    const { rows } = await db.query(insertQ, values);
    res.json(rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
};
