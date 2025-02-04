const express = require('express');
const cors = require('cors');
require('dotenv').config();
const eventsRouter = require('./routes/events');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Add CSP headers middleware before other middleware
app.use((req, res, next) => {
	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; " +
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
			"font-src 'self' https://fonts.gstatic.com; " +
			"img-src 'self' data: https:; " +
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
			"connect-src 'self' https://app.ticketmaster.com;"
	);
	next();
});

// CORS middleware
app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})
);

// Parse JSON bodies
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Basic health check route
app.get('/api/health', (req, res) => {
	res.json({ status: 'OK' });
});

// Events routes
app.use('/api/events', eventsRouter);

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
