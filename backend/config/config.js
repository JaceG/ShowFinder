require('dotenv').config();

module.exports = {
	port: process.env.PORT || 5000,
	eventbriteApiKey: process.env.EVENTBRITE_API_KEY,
	nodeEnv: process.env.NODE_ENV || 'development',
};
