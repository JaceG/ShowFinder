const axios = require('axios');
const config = require('../config/config');

// Cache for Spotify access token
let accessToken = null;
let tokenExpiry = null;

const getSpotifyToken = async () => {
	// Check if we have a valid token
	if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
		return accessToken;
	}

	try {
		const response = await axios.post(
			'https://accounts.spotify.com/api/token',
			'grant_type=client_credentials',
			{
				headers: {
					Authorization: `Basic ${Buffer.from(
						`${config.spotify.clientId}:${config.spotify.clientSecret}`
					).toString('base64')}`,
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		);

		accessToken = response.data.access_token;
		tokenExpiry = Date.now() + response.data.expires_in * 1000;
		return accessToken;
	} catch (error) {
		console.error('Error getting Spotify token:', error);
		throw new Error('Failed to get Spotify access token');
	}
};

const searchArtist = async (req, res) => {
	try {
		const { q } = req.query;

		if (!q) {
			return res.status(400).json({ error: 'Artist name is required' });
		}

		// Clean up the search query by removing tour info
		const cleanQuery = q
			.split('-')[0] // Take only the part before any dash
			.split('(')[0] // Remove parentheses content
			.trim();

		console.log('Searching Spotify for artist:', cleanQuery);

		const token = await getSpotifyToken();

		const response = await axios.get(`https://api.spotify.com/v1/search`, {
			params: {
				q: cleanQuery,
				type: 'artist',
				limit: 1,
				market: 'US', // Add market parameter
			},
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const artist = response.data.artists.items[0];

		if (!artist) {
			console.log('No artist found in Spotify for:', cleanQuery);
			return res.json({ tracks: [], artistId: null });
		}

		console.log(
			'Found Spotify artist:',
			artist.name,
			'(ID:',
			artist.id,
			')'
		);

		// Get top tracks for the artist
		const tracksResponse = await axios.get(
			`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		res.json({
			artistId: artist.id,
			tracks: tracksResponse.data.tracks.map((track) => ({
				id: track.id,
				name: track.name,
				previewUrl: track.preview_url,
				albumArt: track.album.images[0]?.url,
				spotifyUrl: track.external_urls.spotify,
			})),
		});
	} catch (error) {
		console.error(
			'Spotify API Error:',
			error.response?.data || error.message
		);
		res.status(500).json({
			error: 'Failed to fetch Spotify data',
			details: error.response?.data || error.message,
		});
	}
};

const getArtistConcerts = async (req, res) => {
	try {
		const { artistId } = req.query;

		if (!artistId) {
			return res.status(400).json({ error: 'Artist ID is required' });
		}

		console.log('Fetching artist info for ID:', artistId);
		const token = await getSpotifyToken();

		// First check if artist exists
		try {
			console.log(`Making request to Spotify API for artist ${artistId}`);
			const artistResponse = await axios.get(
				`https://api.spotify.com/v1/artists/${artistId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			console.log('Artist API Response:', {
				status: artistResponse.status,
				name: artistResponse.data?.name,
				id: artistResponse.data?.id,
			});

			// Try to get related artists, but don't fail if this errors
			let relatedArtists = [];
			try {
				const relatedResponse = await axios.get(
					`https://api.spotify.com/v1/artists/${artistId}/related-artists`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				relatedArtists = (relatedResponse.data.artists || [])
					.slice(0, 5)
					.map((artist) => ({
						id: artist.id,
						name: artist.name,
						genres: artist.genres || [],
						images: artist.images || [],
					}));
			} catch (relatedError) {
				console.log(
					'Could not fetch related artists, continuing without them'
				);
			}

			console.log(
				'Successfully fetched data for artist:',
				artistResponse.data.name
			);

			res.json({
				artist: {
					name: artistResponse.data.name,
					genres: artistResponse.data.genres || [],
					popularity: artistResponse.data.popularity,
					followers: artistResponse.data.followers?.total || 0,
					images: artistResponse.data.images || [],
				},
				relatedArtists,
			});
		} catch (spotifyError) {
			// Log the full error details
			console.error('Spotify API Error Details:', {
				status: spotifyError.response?.status,
				statusText: spotifyError.response?.statusText,
				data: spotifyError.response?.data,
				message: spotifyError.message,
				headers: spotifyError.response?.headers,
			});

			// Check specifically for 404
			if (spotifyError.response?.status === 404) {
				console.log(`Artist with ID ${artistId} not found in Spotify`);
				return res.status(404).json({
					error: 'Artist not found in Spotify',
					message: 'This artist may not be available on Spotify',
				});
			}

			// Check for rate limiting
			if (spotifyError.response?.status === 429) {
				console.log('Rate limited by Spotify API');
				return res.status(429).json({
					error: 'Too many requests',
					message: 'Please try again later',
				});
			}

			// Check for auth errors
			if (spotifyError.response?.status === 401) {
				console.log('Authentication error with Spotify API');
				return res.status(401).json({
					error: 'Authentication failed',
					message: 'Failed to authenticate with Spotify',
				});
			}

			throw spotifyError;
		}
	} catch (error) {
		console.error('Controller Error:', {
			status: error.response?.status,
			message: error.message,
			details: error.response?.data,
		});

		const status = error.response?.status || 500;
		res.status(status).json({
			error: 'Failed to fetch artist data',
			details: error.response?.data || error.message,
		});
	}
};

module.exports = {
	searchArtist,
	getArtistConcerts,
};
