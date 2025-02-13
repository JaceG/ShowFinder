const Event = require('../models/Event');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const config = require('../config/config');
const axios = require('axios');

// Search events using Ticketmaster API
exports.searchEvents = async (req, res, next) => {
	try {
		const { city } = req.query;
		if (!city) {
			throw new AppError('City is required', 400);
		}

		const response = await axios.get(
			'https://app.ticketmaster.com/discovery/v2/events.json',
			{
				params: {
					apikey: config.apis.ticketmaster,
					keyword: city,
					classificationName: 'music',
					sort: 'date,asc',
					size: 50,
					startDateTime: new Date().toISOString().slice(0, 19) + 'Z',
				},
			}
		);

		// Return events in the expected format
		res.json({ events: response.data._embedded?.events || [] });
	} catch (error) {
		next(error);
	}
};

// Get user's saved events
exports.getSavedEvents = async (req, res, next) => {
	try {
		console.log('Getting saved events for user:', req.user.id);
		const user = await User.findById(req.user.id);

		if (!user) {
			throw new AppError('User not found', 404);
		}

		// Get the events from the events collection
		const savedEvents = await Event.find({
			_id: { $in: user.savedEvents || [] },
		});

		console.log('Found saved events:', savedEvents);
		res.json(savedEvents);
	} catch (error) {
		console.error('Error getting saved events:', error);
		next(error);
	}
};

// Save an event
exports.saveEvent = async (req, res, next) => {
	try {
		const eventData = req.body;
		console.log('Saving event:', eventData);

		// First, try to find if event already exists
		let event = await Event.findOne({ eventId: eventData.eventId });

		// If event doesn't exist, create it
		if (!event) {
			event = await Event.create(eventData);
		}

		// Add event reference to user's saved events
		const user = await User.findById(req.user.id);
		if (!user.savedEvents) {
			user.savedEvents = [];
		}

		if (!user.savedEvents.includes(event._id)) {
			user.savedEvents.push(event._id);
			await user.save();
		}

		res.json({ message: 'Event saved successfully', event });
	} catch (error) {
		console.error('Error saving event:', error);
		next(error);
	}
};

// Unsave an event
exports.unsaveEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		const user = await User.findById(req.user.id);

		if (!user) {
			throw new AppError('User not found', 404);
		}

		// Remove event from user's saved events
		user.savedEvents = user.savedEvents.filter(
			(id) => id.toString() !== eventId
		);
		await user.save();

		res.json({ message: 'Event removed successfully' });
	} catch (error) {
		console.error('Error removing event:', error);
		next(error);
	}
};
