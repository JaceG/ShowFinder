require('dotenv').config();

module.exports = {
	port: process.env.PORT || 3333,
	ticketmaster: {
		apiKey: process.env.TICKETMASTER_API_KEY,
	},
	nodeEnv: process.env.NODE_ENV || 'development',
};
