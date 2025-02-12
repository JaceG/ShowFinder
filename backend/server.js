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

// Enhanced error logging middleware
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
	const oldSend = res.send;
	res.send = function (data) {
		console.log(
			`Response for ${req.method} ${req.url}: Status ${res.statusCode}`
		);
		return oldSend.apply(res, arguments);
	};
	next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// API routes
app.use('/api/weather', weatherRoutes);
app.use('/api/spotify', spotifyRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
	console.log('Catch-all route hit for:', req.url);
	res.sendFile(
		path.join(__dirname, '../frontend/build/index.html'),
		(err) => {
			if (err) {
				console.error('Error sending file:', err);
				res.status(500).send(err);
			}
		}
	);
});

// Global error handler
app.use((err, req, res, next) => {
	console.error('Global error handler caught:', {
		error: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
	});
	res.status(500).json({
		error: 'Internal Server Error',
		message: err.message,
		path: req.url,
	});
});

// Catch unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
});

// Middleware
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});

// Handle 404s for API routes
app.use('/api/*', (req, res) => {
	res.status(404).json({ error: 'API endpoint not found' });
});

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

module.exports = app;
