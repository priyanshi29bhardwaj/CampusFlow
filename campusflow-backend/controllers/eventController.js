const db = require('../config/database');
const { sendRegistrationEmail } = require('../utils/mailer');


/* =====================================================
   CREATE EVENT
===================================================== */
exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      venueId,
      startTime,
      endTime,
      capacity,
      registrationFee,
      paymentQrCode
    } = req.body;

    let finalClubId;

    if (req.user.role === 'club_owner') {
      if (!req.user.clubId) {
        return res.status(403).json({
          error: 'Your account is not associated with a club.'
        });
      }
      finalClubId = req.user.clubId;

    } else if (req.user.role === 'admin') {
      finalClubId = req.body.clubId;
    } else {
      return res.status(403).json({
        error: 'Only club owners or admins can create events.'
      });
    }

    if (!name || !startTime || !endTime) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const q = `
      INSERT INTO events
      (name, description, venue_id, start_time, end_time, capacity, registration_fee, payment_qr_code, club_id, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `;

    const values = [
      name,
      description,
      venueId,
      startTime,
      endTime,
      capacity,
      registrationFee,
      paymentQrCode,
      finalClubId,
      req.user.id
    ];

    const { rows } = await db.query(q, values);
    res.json(rows[0]);

  } catch (err) {
    console.error('Create Event Error:', err);
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   LIST EVENTS
===================================================== */
exports.listEvents = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM events ORDER BY start_time DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   GET SINGLE EVENT
===================================================== */
exports.getEvent = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM events WHERE id=$1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   REGISTER FOR EVENT + SEND EMAIL
===================================================== */
exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { numberOfTickets = 1, paymentMethod, transactionId } = req.body;
    const userId = req.user.id;

    /* GET EVENT DETAILS */
    const ev = await db.query(
      `SELECT e.name, e.start_time, e.registration_fee,
              v.name AS venue_name
       FROM events e
       LEFT JOIN venues v ON e.venue_id = v.id
       WHERE e.id=$1`,
      [eventId]
    );

    if (ev.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = ev.rows[0];

    const total =
      Number(event.registration_fee || 0) * Number(numberOfTickets);

    /* INSERT REGISTRATION */
    const insertQuery = `
      INSERT INTO event_registrations
      (event_id, user_id, number_of_tickets, total_amount, payment_method, transaction_id, payment_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
    `;

    const { rows } = await db.query(insertQuery, [
      eventId,
      userId,
      numberOfTickets,
      total,
      paymentMethod,
      transactionId,
      'completed'
    ]);

    /* SEND EMAIL */
    try {
      await sendRegistrationEmail(req.user.email, {
        name: event.name,
        start_time: event.start_time,
        venue_name: event.venue_name
      });
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   UPDATE EVENT
===================================================== */
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const eventCheck = await db.query('SELECT club_id FROM events WHERE id = $1', [eventId]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventClubId = eventCheck.rows[0].club_id;

    if (req.user.role === 'club_owner' && eventClubId !== req.user.clubId) {
      return res.status(403).json({ error: "You can only edit your own club's events" });
    }

    const { name, description, startTime, endTime } = req.body;

    const { rows } = await db.query(
      `UPDATE events SET name=$1, description=$2, start_time=$3, end_time=$4 WHERE id=$5 RETURNING *`,
      [name, description, startTime, endTime, eventId]
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   DELETE EVENT
===================================================== */
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const eventCheck = await db.query('SELECT club_id FROM events WHERE id = $1', [eventId]);
    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventClubId = eventCheck.rows[0].club_id;

    if (req.user.role === 'club_owner' && eventClubId !== req.user.clubId) {
      return res.status(403).json({ error: "You can only delete your own club's events" });
    }

    await db.query('DELETE FROM events WHERE id=$1', [eventId]);
    res.json({ message: 'Event deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* =====================================================
   GET EVENT REGISTRATIONS
===================================================== */
exports.getEventRegistrations = async (req, res) => {
  try {
    const eventId = req.params.id;

    const { rows } = await db.query(`
      SELECT 
        u.first_name || ' ' || u.last_name AS name,
        u.email,
        er.number_of_tickets,
        er.total_amount,
        er.payment_status
      FROM event_registrations er
      JOIN users u ON u.id = er.user_id
      WHERE er.event_id = $1
      ORDER BY u.first_name
    `, [eventId]);

    res.json(rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};