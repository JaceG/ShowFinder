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
		const user = await User.findById(req.user.id).populate('savedEvents');
		res.json(user.savedEvents);
	} catch (error) {
		next(error);
	}
};

// Save an event
exports.saveEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		const user = await User.findById(req.user.id);

		if (!user.savedEvents.includes(eventId)) {
			user.savedEvents.push(eventId);
			await user.save();
		}

		res.json({ message: 'Event saved successfully' });
	} catch (error) {
		next(error);
	}
};

// Unsave an event
exports.unsaveEvent = async (req, res, next) => {
	try {
		const { eventId } = req.params;
		const user = await User.findById(req.user.id);

		user.savedEvents = user.savedEvents.filter(
			(id) => id.toString() !== eventId
		);
		await user.save();

		res.json({ message: 'Event removed successfully' });
	} catch (error) {
		next(error);
	}
};
