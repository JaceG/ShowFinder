const axios = require('axios');
const config = require('../config/config');
const User = require('../models/User');
const SavedEvent = require('../models/SavedEvent');

const getEvents = async (req, res) => {
	try {
		const { city } = req.query;
		console.log('Received request for city:', city);
		console.log(
			'API Key:',
			config.ticketmaster.apiKey ? 'Present' : 'Missing'
		);

		if (!city) {
			return res
				.status(400)
				.json({ error: 'City parameter is required' });
		}

		if (!config.ticketmaster.apiKey) {
			return res
				.status(500)
				.json({ error: 'Ticketmaster API key is not configured' });
		}

		const apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
		const apiKey = config.ticketmaster.apiKey;

		console.log('Making request to Ticketmaster API:', {
			url: apiUrl,
			params: { city },
		});

		const response = await axios({
			method: 'get',
			url: apiUrl,
			params: {
				apikey: apiKey,
				keyword: city,
				classificationName: 'music',
				sort: 'date,asc',
				size: 50,
				startDateTime: new Date().toISOString().slice(0, 19) + 'Z',
				includeVenues: true,
				expandVenues: true,
			},
		});

		const events = response.data._embedded?.events || [];
		console.log('Search successful, found:', events.length, 'events');
		res.json({ events });
	} catch (error) {
		console.error('Error in getEvents:', {
			message: error.message,
			stack: error.stack,
			response: {
				status: error.response?.status,
				data: error.response?.data,
			},
		});

		res.status(error.response?.status || 500).json({
			error: 'Error fetching events',
			details: error.response?.data || error.message,
		});
	}
};

const saveEvent = async (req, res) => {
	try {
		const userId = req.user.id;
		const { eventId, eventData } = req.body;

		const savedEvent = await SavedEvent.create({
			userId,
			eventId,
			eventData
		});

		res.status(201).json({ message: 'Event saved successfully', savedEvent });
	} catch (error) {
		console.error('Error saving event:', error);
		res.status(500).json({ error: 'Error saving event' });
	}
};

const getSavedEvents = async (req, res) => {
	try {
		const userId = req.user.id;
		const savedEvents = await SavedEvent.find({ userId });
		res.json({ savedEvents });
	} catch (error) {
		console.error('Error fetching saved events:', error);
		res.status(500).json({ error: 'Error fetching saved events' });
	}
};

const removeSavedEvent = async (req, res) => {
	try {
		const userId = req.user.id;
		const { eventId } = req.params;

		await SavedEvent.findOneAndDelete({ userId, eventId });
		res.json({ message: 'Event removed successfully' });
	} catch (error) {
		console.error('Error removing saved event:', error);
		res.status(500).json({ error: 'Error removing saved event' });
	}
};

module.exports = {
	getEvents,
	saveEvent,
	getSavedEvents,
	removeSavedEvent
};
