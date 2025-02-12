const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config/config');
const { getArtistConcerts } = require('../controllers/spotifyController');

// In-memory token storage (resets on server restart)
let tokenData = {
	access_token: null,
	expires_at: null,
};

// Get a new access token using client credentials
async function getAccessToken() {
	try {
		// Check if current token is still valid (with 1-minute buffer)
		if (
			tokenData.access_token &&
			tokenData.expires_at &&
			Date.now() < tokenData.expires_at - 60000
		) {
			return tokenData.access_token;
		}

		// Request new token
		const response = await axios.post(
			'https://accounts.spotify.com/api/token',
			new URLSearchParams({
				grant_type: 'client_credentials',
			}).toString(),
			{
				headers: {
					Authorization: `Basic ${Buffer.from(
						`${config.apis.spotify.clientId}:${config.apis.spotify.clientSecret}`
					).toString('base64')}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		// Store token with expiry
		tokenData = {
			access_token: response.data.access_token,
			expires_at: Date.now() + response.data.expires_in * 1000,
		};

		return tokenData.access_token;
	} catch (error) {
		console.error(
			'Failed to get Spotify token:',
			error.response?.data || error.message
		);
		throw new Error('Failed to authenticate with Spotify');
	}
}

router.get('/search', async (req, res) => {
	try {
		const { q } = req.query;
		if (!q) {
			return res.status(400).json({ error: 'Search query is required' });
		}

		// Get valid token
		const token = await getAccessToken();

		// Make Spotify API request
		const response = await axios.get('https://api.spotify.com/v1/search', {
			params: {
				q,
				type: 'artist,track',
				limit: 10,
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		res.json(response.data);
	} catch (error) {
		console.error(
			'Spotify API error:',
			error.response?.data || error.message
		);
		res.status(500).json({
			error: 'Failed to fetch from Spotify API',
			details: error.response?.data?.error?.message || error.message,
		});
	}
});

router.get('/concerts', getArtistConcerts);

module.exports = router;
