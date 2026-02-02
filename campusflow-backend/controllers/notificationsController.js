const db = require('../config/database');

exports.listMyNotifications = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT id, title, body, created_at, read
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [req.user.id]
    );
    res.json(rows.map(n => ({
      id: n.id,
      title: n.title,
      message: n.body,
      type: 'announcement',
      timestamp: n.created_at,
      read: n.read,
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query(
      `UPDATE notifications SET read = true WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

// helper to create a notification
exports.createForUser = async (userId, { title, message, type = 'announcement' }) => {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, title, body, read)
       VALUES ($1, $2, $3, false)`,
      [userId, title, message]
    );
  } catch (err) {
    console.error('Failed to create notification', err.message);
  }
};


