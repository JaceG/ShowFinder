const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const eventsRouter = require('./routes/events');
const path = require('path');
const googleRouter = require('./routes/google');
const weatherRouter = require('./routes/weather');
const spotifyRouter = require('./routes/spotify');
const userRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3333;

// Add CSP headers middleware before other middleware
app.use((req, res, next) => {
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; " +
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
			"font-src 'self' https://fonts.gstatic.com; " +
			"img-src 'self' data: https:; " +
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com; " +
			"frame-src 'self' https://www.youtube.com; " +
			"connect-src 'self' https://app.ticketmaster.com https://*.googleapis.com https://openweathermap.org;"
	);
	next();
});

// CORS middleware
app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'production'
				? true // Allow all origins in production
				: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

// Parse JSON bodies
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Update MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventapp')
	.then(() => console.log('Connected to MongoDB'))
	.catch(err => console.error('MongoDB connection error:', err));

// Basic health check route
app.get('/api/health', (req, res) => {
	res.json({ status: 'OK' });
});

// Events routes
app.use('/api/events', eventsRouter);
app.use('/api/google', googleRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/spotify', spotifyRouter);
app.use('/api/users', userRouter);

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
