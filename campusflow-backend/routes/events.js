// routes/events.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const eventController = require('../controllers/eventController');

router.post('/', auth, roleCheck(['club_owner','admin']), eventController.createEvent);
router.get('/', eventController.listEvents);
router.get('/:id', eventController.getEvent);
router.post('/:id/register', auth, eventController.registerForEvent);
router.delete('/:id', auth, roleCheck(['club_owner','admin']), eventController.deleteEvent);

module.exports = router;