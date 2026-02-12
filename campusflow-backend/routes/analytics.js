const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const db = require("../config/database");

router.get("/club", auth, async (req, res) => {
  try {
    const { rows: userRows } = await db.query(
      "SELECT club_id FROM users WHERE id = $1",
      [req.user.id]
    );

    if (!userRows.length || !userRows[0].club_id) {
      return res.status(403).json({ message: "No club assigned to user" });
    }

    const clubId = userRows[0].club_id;

    const { rows } = await db.query(
      `
      SELECT 
        e.id,
        e.name,
        e.capacity,
        e.registration_fee,
        e.start_time,
        COALESCE(SUM(r.number_of_tickets), 0) AS total_registrations,
        COALESCE(SUM(r.number_of_tickets * e.registration_fee), 0) AS total_revenue
      FROM events e
      LEFT JOIN event_registrations r ON e.id = r.event_id
      WHERE e.club_id = $1
      GROUP BY e.id
      ORDER BY e.start_time DESC
      `,
      [clubId]
    );

    const now = new Date();

    const pastEvents = rows.filter(
      (event) => new Date(event.start_time) < now
    );

    const upcomingEvents = rows.filter(
      (event) => new Date(event.start_time) >= now
    );

    res.json({
      pastEvents,
      upcomingEvents
    });

  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
