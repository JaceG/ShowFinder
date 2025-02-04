require('dotenv').config();

module.exports = {
	port: process.env.PORT || 3333,
	ticketmaster: {
		apiKey: process.env.TICKETMASTER_API_KEY,
	},
	youtube: {
		apiKey: process.env.YOUTUBE_API_KEY,
	},
	weather: {
		apiKey: process.env.OPENWEATHER_API_KEY,
	},
	nodeEnv: process.env.NODE_ENV || 'development',
};
