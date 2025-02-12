const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const weatherRoutes = require('./routes/weather');
const spotifyRoutes = require('./routes/spotify');
const googleRoutes = require('./routes/google');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

const app = express();

// Add CSP headers middleware before other middleware
app.use((req, res, next) => {
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; " +
			"style-src 'self' 'unsafe-inline'; " +
			"style-src-elem 'self' 'unsafe-inline'; " +
			"font-src 'self' data:; " +
			"img-src 'self' data: https: blob:; " +
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com; " +
			"frame-src 'self' https://www.youtube.com; " +
			"connect-src 'self' https://app.ticketmaster.com https://*.googleapis.com https://api.openweathermap.org"
	);
	next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});

// API Routes
app.use('/api/weather', weatherRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Handle 404s for API routes
app.use('/api/*', (req, res) => {
	res.status(404).json({ error: 'API endpoint not found' });
});

// Serve static files in production
if (config.nodeEnv === 'production') {
	app.use(express.static(path.join(__dirname, '../frontend/build')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
	});
}

// Error Handler (single handler)
app.use(errorHandler);

const PORT = config.port || 3333;

// Server startup
const startServer = async () => {
	try {
		await connectDB();
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
			console.log(`Environment: ${config.nodeEnv}`);
			console.log('Database connected');
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	console.log(err.name, err.message);
	process.exit(1);
});

module.exports = app;
