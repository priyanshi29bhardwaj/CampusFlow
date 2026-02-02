// routes/venues.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const venueController = require('../controllers/venueController');

router.get('/', venueController.listVenues);
router.get('/:id/availability', venueController.checkAvailability); // query params ?start=...&end=...
router.post('/:id/book', auth, roleCheck(['club_owner','admin']), venueController.bookVenue);

module.exports = router;
