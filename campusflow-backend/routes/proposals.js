// routes/proposals.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const proposalController = require('../controllers/proposalController');

router.post('/', auth, roleCheck(['club_owner','admin']), proposalController.createProposal);

module.exports = router;
