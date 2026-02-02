// controllers/proposalController.js
const db = require('../config/database');

exports.createProposal = async (req, res) => {
  try {
    const { eventId, content, submittedTo } = req.body;

    // 🔒 Step 1: Check event exists and get its club
    const eventCheck = await db.query(
      'SELECT club_id FROM events WHERE id = $1',
      [eventId]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventClubId = eventCheck.rows[0].club_id;

    // 🔒 Step 2: Club owner can only create proposal for their own club event
    if (req.user.role === 'club_owner' && eventClubId !== req.user.clubId) {
      return res.status(403).json({
        error: "You can only create proposals for your own club's events",
      });
    }

    // ✅ Step 3: Insert proposal
    const q = `
      INSERT INTO proposal_letters (event_id, club_id, content, submitted_to)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [eventId, req.user.clubId, content, submittedTo];

    const { rows } = await db.query(q, values);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
