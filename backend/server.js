const express = require('express');
const cors = require('cors');
require('dotenv').config();
const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 5000;

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

// Basic health check route
app.get('/api/health', (req, res) => {
	res.json({ status: 'OK' });
});

// Events routes
app.use('/api/events', eventsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
