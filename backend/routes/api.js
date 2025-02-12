const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config/config');

// Weather API route
router.get('/weather', async (req, res) => {
	try {
		const { lat, lon, date } = req.query;
		const response = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather`,
			{
				params: {
					lat,
					lon,
					appid: config.apis.openWeather,
					units: 'metric',
				},
			}
		);
		res.json(response.data);
	} catch (error) {
		console.error('Weather API error:', error);
		res.status(500).json({ error: 'Failed to fetch weather data' });
	}
});

// YouTube API route
router.get('/google/youtube', async (req, res) => {
	try {
		const { q } = req.query;
		const response = await axios.get(
			`https://www.googleapis.com/youtube/v3/search`,
			{
				params: {
					part: 'snippet',
					q,
					type: 'video',
					maxResults: 5,
					key: config.apis.google,
				},
			}
		);
		const videos = response.data.items.map((item) => ({
			id: item.id.videoId,
			title: item.snippet.title,
			thumbnail: item.snippet.thumbnails.default.url,
		}));
		res.json({ videos });
	} catch (error) {
		console.error('YouTube API error:', error);
		res.status(500).json({
			error: 'Failed to fetch YouTube data',
			videos: [],
		});
	}
});

module.exports = router;
