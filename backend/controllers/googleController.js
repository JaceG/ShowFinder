const axios = require('axios');
const config = require('../config/config');

const searchYouTube = async (req, res) => {
	try {
		const { q } = req.query;

		if (!q) {
			return res.status(400).json({ error: 'Search query is required' });
		}

		if (!config.google.apiKey) {
			console.error('Google API key is missing');
			return res
				.status(500)
				.json({ error: 'Google API key is not configured' });
		}

		console.log('Searching YouTube for:', q);

		const response = await axios.get(
			'https://www.googleapis.com/youtube/v3/search',
			{
				params: {
					part: 'snippet',
					maxResults: 3,
					q: `${q} live performance`,
					type: 'video',
					key: config.google.apiKey,
				},
			}
		);

		console.log('YouTube API response status:', response.status);

		const videos = response.data.items.map((item) => ({
			id: item.id.videoId,
			title: item.snippet.title,
			thumbnail: item.snippet.thumbnails.high.url,
		}));

		console.log('Found videos:', videos.length);
		res.json({ videos });
	} catch (error) {
		console.error(
			'YouTube API Error:',
			error.response?.data || error.message
		);
		res.status(500).json({
			error: 'Failed to fetch YouTube videos',
			details: error.response?.data || error.message,
		});
	}
};

module.exports = {
	searchYouTube,
	// We can add other Google API methods here later
};
