const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');
const config = require('../config/config');
const User = require('../models/User');
const eventController = require('../controllers/eventController');

// Public routes
router.get('/', eventController.searchEvents);
// router.get('/:eventId', eventController.getEventDetails);  // Comment this out for now since it's not implemented

// Protected routes - require authentication
router.get('/saved', auth, eventController.getSavedEvents);
router.post('/save', auth, eventController.saveEvent);
router.delete('/save/:eventId', auth, eventController.unsaveEvent);

module.exports = router;
