import { API_URL } from './index';

const searchYouTubeVideos = async (query) => {
	try {
		const params = new URLSearchParams({
			q: query,
		});

		const response = await fetch(`${API_URL}/google/youtube?${params}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('YouTube API error response:', errorText);
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();
		return data.videos;
	} catch (error) {
		console.error('Error fetching YouTube videos:', error);
		throw error;
	}
};

export { searchYouTubeVideos };
