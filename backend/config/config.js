require('dotenv').config();

const config = {
	nodeEnv: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3333,
	mongoUri: process.env.MONGODB_URI,
	jwtSecret: process.env.JWT_SECRET,
	apis: {
		ticketmaster: process.env.TICKETMASTER_API_KEY,
		openweather: process.env.OPENWEATHER_API_KEY,
		spotify: {
			clientId: process.env.SPOTIFY_CLIENT_ID,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
		},
		google: process.env.GOOGLE_API_KEY,
	},
	mongodb: {
		uri:
			process.env.MONGODB_URI || 'mongodb://localhost:27017/eventplanner',
	},
};

// Validate required API keys
const requiredKeys = [
	'ticketmaster',
	'openweather',
	'spotify.clientId',
	'spotify.clientSecret',
	'google',
];

requiredKeys.forEach((key) => {
	const value = key.split('.').reduce((obj, k) => obj && obj[k], config.apis);
	if (!value) {
		console.warn(`Warning: ${key} API key is not configured`);
	}
});

// Log config on startup (excluding sensitive values)
console.log('Config loaded:', {
	port: config.port,
	nodeEnv: config.nodeEnv,
	apis: {
		openweather: config.apis.openweather ? '✓' : '✗',
		google: config.apis.google ? '✓' : '✗',
		spotify: config.apis.spotify ? '✓' : '✗',
		ticketmaster: config.apis.ticketmaster ? '✓' : '✗',
	},
});

module.exports = config;
