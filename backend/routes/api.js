const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.get('/events', eventsController.getEvents);
router.post('/users/signup', userController.signup);
router.post('/users/login', userController.login);

// Protected routes
router.post('/events/save', auth, eventsController.saveEvent);
router.get('/events/saved', auth, eventsController.getSavedEvents);
router.delete('/events/saved/:eventId', auth, eventsController.removeSavedEvent);

module.exports = router; 