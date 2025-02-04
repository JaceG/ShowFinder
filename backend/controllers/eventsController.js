const axios = require('axios');
const config = require('../config/config');

const getEvents = async (req, res) => {
	try {
		const { city } = req.query;
		// TODO: Implement Eventbrite API call
		res.json({ message: `Searching events in ${city}` });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	getEvents,
};
