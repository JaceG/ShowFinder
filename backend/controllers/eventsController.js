const axios = require('axios');
const config = require('../config/config');

const getEvents = async (req, res) => {
	try {
		const { city } = req.query;
		console.log('Received request for city:', city);

		if (!city) {
			return res
				.status(400)
				.json({ error: 'City parameter is required' });
		}

		const apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';
		const apiKey = config.ticketmaster.apiKey;

		console.log('Making request to Ticketmaster API:', {
			url: apiUrl,
			params: {
				city,
				classificationName: 'music',
			},
		});

		const response = await axios({
			method: 'get',
			url: apiUrl,
			params: {
				apikey: apiKey,
				city: city,
				classificationName: 'music',
				sort: 'date,asc',
				size: 50,
			},
		});

		const events = response.data._embedded?.events || [];
		console.log('Search successful, found:', events.length, 'events');
		res.json({ events });
	} catch (error) {
		console.error('Error details:', {
			message: error.message,
			status: error.response?.status,
			data: error.response?.data,
			headers: error.response?.headers,
		});

		res.status(error.response?.status || 500).json({
			error: 'Error fetching events',
			details: error.response?.data || error.message,
		});
	}
};

module.exports = {
	getEvents,
};
