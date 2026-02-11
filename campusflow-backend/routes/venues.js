// routes/venues.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const venueController = require('../controllers/venueController');

/* ================= ADMIN ROUTES (MUST COME FIRST) ================= */
router.get('/admin/bookings', auth, roleCheck(['admin']), venueController.getAllBookings);
router.put('/admin/bookings/:id/status', auth, roleCheck(['admin']), venueController.updateBookingStatus);

/* ================= GENERAL VENUE ROUTES ================= */
router.get('/', venueController.listVenues);
router.get('/:id/availability', venueController.checkAvailability); // ?start=...&end=...
router.post('/:id/book', auth, roleCheck(['club_owner','admin']), venueController.bookVenue);
router.get('/my-bookings', auth, roleCheck(['club_owner','admin']), venueController.getMyBookings);

module.exports = router;
