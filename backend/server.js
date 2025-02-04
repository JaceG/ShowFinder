const express = require('express');
const cors = require('cors');
require('dotenv').config();
const eventsRouter = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
	res.json({ status: 'OK' });
});

// Events routes
app.use('/api/events', eventsRouter);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
