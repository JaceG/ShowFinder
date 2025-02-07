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
		console.error('Error in getEvents:', error);
		res.status(error.response?.status || 500).json({
			error: 'Error fetching events',
			details: error.response?.data || error.message,
		});
	}
};

const saveEvent = async (req, res) => {
	try {
		const userId = req.user.id;
		const { eventData } = req.body;
		console.log('Saving event:', { userId, eventData }); // Debug log

		const savedEvent = new SavedEvent({
			userId,
			eventId: eventData.id,
			eventData
		});

		await savedEvent.save();
		console.log('Event saved successfully:', savedEvent); // Debug log
		res.status(201).json({ message: 'Event saved successfully', event: savedEvent });
	} catch (error) {
		console.error('Error saving event:', error);
		if (error.code === 11000) {
			return res.status(400).json({ message: 'Event already saved' });
		}
		res.status(500).json({ message: 'Error saving event', error: error.message });
	}
};

const getSavedEvents = async (req, res) => {
	try {
		const userId = req.user.id;
		console.log('Getting saved events for user:', userId); // Debug log
		const savedEvents = await SavedEvent.find({ userId });
		console.log('Found saved events:', savedEvents); // Debug log
		res.json({ savedEvents });
	} catch (error) {
		console.error('Error fetching saved events:', error);
		res.status(500).json({ message: 'Error fetching saved events', error: error.message });
	}
};

const removeSavedEvent = async (req, res) => {
	try {
		const userId = req.user.id;
		const { eventId } = req.params;
		console.log('Removing event:', { userId, eventId }); // Debug log

		const result = await SavedEvent.findOneAndDelete({ userId, eventId });
		if (!result) {
			return res.status(404).json({ message: 'Event not found' });
		}

		console.log('Event removed successfully:', result); // Debug log
		res.json({ message: 'Event removed successfully' });
	} catch (error) {
		console.error('Error removing saved event:', error);
		res.status(500).json({ message: 'Error removing event', error: error.message });
	}
};

module.exports = {
	getEvents,
	saveEvent,
	getSavedEvents,
	removeSavedEvent
};
