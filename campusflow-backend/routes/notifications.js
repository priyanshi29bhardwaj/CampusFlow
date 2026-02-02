const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notifications = require('../controllers/notificationsController');

router.get('/', auth, notifications.listMyNotifications);
router.patch('/:id/read', auth, notifications.markRead);

module.exports = router;


