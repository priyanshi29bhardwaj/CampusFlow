// routes/clubs.js
const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

router.get('/', clubController.listClubs);
router.get('/:id', clubController.getClub);

module.exports = router;

