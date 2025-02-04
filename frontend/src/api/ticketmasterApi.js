const API_URL =
	process.env.NODE_ENV === 'production'
		? '/api'
		: 'http://localhost:3333/api';

export const searchEvents = async (city) => {
	try {
		const response = await fetch(
			`${API_URL}/events?city=${encodeURIComponent(city)}`
		);
		if (!response.ok) {
			const text = await response.text();
			console.error('API Response:', text);
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		console.log('API Response data:', data);
		return data;
	} catch (error) {
		console.error('Error fetching events:', error);
		throw error;
	}
};
