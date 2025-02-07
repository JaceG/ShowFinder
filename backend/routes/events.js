const express = require('express');
const router = express.Router();
const { getEvents, saveEvent, getSavedEvents, removeSavedEvent } = require('../controllers/eventsController');
const auth = require('../middleware/auth');

// Test route
router.get('/test', (req, res) => {
	res.json({ message: 'Events route is working' });
});

// Events search route
router.get('/', getEvents);

// Save event route (protected)
router.post('/save', auth, saveEvent);

// Get saved events route (protected)
router.get('/saved', auth, getSavedEvents);

// Delete saved event route (protected)
router.delete('/saved/:eventId', auth, removeSavedEvent);

module.exports = router;
