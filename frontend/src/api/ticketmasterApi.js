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

export const saveEvent = async (eventData) => {
	try {
		console.log('Attempting to save event:', eventData);
		const response = await fetch(`${API_URL}/events/save`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
			body: JSON.stringify({
				eventId: eventData.id,
				name: eventData.name,
				date: eventData.dates.start.localDate,
				venue:
					eventData._embedded?.venues?.[0]?.name || 'Unknown Venue',
				city:
					eventData._embedded?.venues?.[0]?.city?.name ||
					'Unknown City',
				imageUrl: eventData.images?.[0]?.url,
				ticketUrl: eventData.url,
				eventData: eventData, // Store the full event data
			}),
		});

		if (!response.ok) {
			const data = await response.json();
			throw new Error(data.message || 'Failed to save event');
		}

		return await response.json();
	} catch (error) {
		console.error('Error saving event:', error);
		throw error;
	}
};

export const getSavedEvents = async () => {
	try {
		console.log('Fetching saved events'); // Debug log
		const response = await fetch(`${API_URL}/events/saved`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});

		const data = await response.json();

		if (!response.ok) {
			console.error('Get saved events error:', data); // Debug log
			throw new Error(data.message || 'Failed to fetch saved events');
		}

		console.log('Get saved events response:', data); // Debug log
		return data;
	} catch (error) {
		console.error('Error fetching saved events:', error);
		throw error;
	}
};

export const unsaveEvent = async (eventId) => {
	try {
		console.log('Attempting to unsave event:', eventId);
		const response = await fetch(`${API_URL}/events/save/${eventId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});

		const data = await response.json();

		if (!response.ok) {
			console.error('Error response:', data);
			throw new Error(data.message || 'Failed to unsave event');
		}

		return data;
	} catch (error) {
		console.error('Error unsaving event:', error);
		throw error;
	}
};
