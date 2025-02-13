const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config/config');

// YouTube search endpoint
router.get('/youtube', async (req, res) => {
	try {
		const { q } = req.query;
		console.log('YouTube search query:', q);

		if (!q) {
			return res.status(400).json({
				error: 'Search query is required',
				videos: [],
			});
		}

		const apiKey = config.apis.google;
		if (!apiKey) {
			console.error('Google API key is missing');
			return res.status(500).json({
				error: 'Google API configuration error',
				videos: [],
			});
		}

		const response = await axios.get(
			`https://youtube.googleapis.com/youtube/v3/search`,
			{
				params: {
					part: 'snippet',
					maxResults: 5,
					q: q,
					type: 'video',
					key: apiKey,
				},
				headers: {
					Accept: 'application/json',
				},
			}
		);

		if (!response.data || !response.data.items) {
			console.error('Invalid YouTube API response:', response.data);
			throw new Error('Invalid YouTube API response');
		}

		const videos = response.data.items.map((item) => ({
			id: item.id.videoId,
			title: item.snippet.title,
			thumbnail: item.snippet.thumbnails.medium.url,
			description: item.snippet.description,
		}));

		console.log(`Found ${videos.length} videos for query:`, q);
		res.json({ videos });
	} catch (error) {
		console.error(
			'YouTube API Error:',
			error.response?.data || error.message
		);

		// More detailed error response
		const errorMessage =
			error.response?.data?.error?.message || error.message;
		const errorCode = error.response?.status || 500;

		res.status(errorCode).json({
			error: errorMessage,
			videos: [],
		});
	}
});

// Google Maps API key endpoint
router.get('/maps/key', (req, res) => {
	const apiKey = config.apis.google;
	res.json({ key: apiKey || null });
});

module.exports = router;
