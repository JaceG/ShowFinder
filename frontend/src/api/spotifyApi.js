import { API_URL } from './index';

export const searchArtist = async (query) => {
	try {
		const response = await fetch(
			`${API_URL}/spotify/search?q=${encodeURIComponent(query)}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch artist data');
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching Spotify data:', error);
		throw error;
	}
};

export const searchSpotifyArtist = async (query) => {
	try {
		const response = await fetch(
			`${API_URL}/spotify/search?q=${encodeURIComponent(query)}`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch Spotify artist');
		}

		const data = await response.json();
		return data.artistId || null;
	} catch (error) {
		console.error('Error fetching Spotify artist:', error);
		throw error;
	}
};
