const express = require('express');
const router = express.Router();
const { getEvents } = require('../controllers/eventsController');

// Test route
router.get('/test', (req, res) => {
	res.json({ message: 'Events route is working' });
});

// Events search route
router.get('/', getEvents);

module.exports = router;
