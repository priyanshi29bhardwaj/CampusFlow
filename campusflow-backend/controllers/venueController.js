const db = require('../config/database');

/* =====================================================
   LIST ALL VENUES
===================================================== */
exports.listVenues = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM venues ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error('List Venues Error:', err);
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   CHECK VENUE AVAILABILITY
   GET /api/venues/:id/availability?start=...&end=...
===================================================== */
exports.checkAvailability = async (req, res) => {
  try {
    const venueId = req.params.id;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: 'start and end query params required' });
    }

    const q = `
      SELECT * FROM venue_bookings
      WHERE venue_id = $1
        AND status != 'rejected'
        AND NOT (booked_end <= $2 OR booked_start >= $3)
      ORDER BY booked_start
    `;

    const { rows } = await db.query(q, [venueId, start, end]);

    res.json({
      available: rows.length === 0,
      conflicts: rows
    });

  } catch (err) {
    console.error('Availability Check Error:', err);
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   BOOK VENUE
===================================================== */
exports.bookVenue = async (req, res) => {
  try {
    const venueId = req.params.id;
    const { bookedStart, bookedEnd, expectedAttendees, specialRequirements } = req.body;

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
      return res.status(403).json({ error: 'Your account is not associated with a club.' });
    }

    /* 1️⃣ VENUE CAPACITY CHECK */
    const venueRes = await db.query(
      'SELECT capacity FROM venues WHERE id = $1',
      [venueId]
    );

    if (venueRes.rows.length === 0) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    const venueCapacity = venueRes.rows[0].capacity;

    if (expectedAttendees && expectedAttendees > venueCapacity) {
      return res.status(400).json({
        error: `Venue capacity is only ${venueCapacity} people`
      });
    }

    /* 2️⃣ VENUE CLASH DETECTION */
    const conflictQuery = `
      SELECT id FROM venue_bookings
      WHERE venue_id = $1
        AND status != 'rejected'
        AND NOT (booked_end <= $2 OR booked_start >= $3)
    `;

    const conflicts = await db.query(conflictQuery, [venueId, bookedStart, bookedEnd]);

    if (conflicts.rows.length > 0) {
      return res.status(400).json({
        error: 'Venue already booked for the selected time'
      });
    }

    /* 3️⃣ INSERT BOOKING */
    const insertQ = `
      INSERT INTO venue_bookings
      (venue_id, club_id, booked_start, booked_end, expected_attendees, special_requirements, created_by, status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,'pending')
      RETURNING *
    `;

    const values = [
      venueId,
      req.user.clubId,
      bookedStart,
      bookedEnd,
      expectedAttendees || null,
      specialRequirements || null,
      req.user.id
    ];

    const { rows } = await db.query(insertQ, values);
    res.json(rows[0]);

  } catch (err) {
    console.error('Book Venue Error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const clubId = req.user.clubId;

    const q = `
      SELECT 
        vb.id,
        v.name AS venue_name,
        vb.booked_start,
        vb.booked_end,
        vb.expected_attendees,
        vb.special_requirements,
        vb.status
      FROM venue_bookings vb
      JOIN venues v ON v.id = vb.venue_id
      WHERE vb.club_id = $1
      ORDER BY vb.created_at DESC
    `;

    const { rows } = await db.query(q, [clubId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const q = `
      SELECT 
        vb.id,
        v.name AS venue_name,
        c.name AS club_name,
        vb.booked_start,
        vb.booked_end,
        vb.expected_attendees,
        vb.special_requirements,
        vb.status
      FROM venue_bookings vb
      JOIN venues v ON v.id = vb.venue_id
      JOIN clubs c ON c.id = vb.club_id
      ORDER BY vb.created_at DESC
    `

    const { rows } = await db.query(q)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id
    const { status, adminRemarks } = req.body

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" })
    }

    const q = `
      UPDATE venue_bookings
      SET status = $1, admin_remarks = $2
      WHERE id = $3
      RETURNING *
    `

    const { rows } = await db.query(q, [status, adminRemarks || null, bookingId])
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}