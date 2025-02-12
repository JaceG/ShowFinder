// Base API URL configuration
export const API_URL =
	process.env.NODE_ENV === 'production'
		? '/api'
		: 'http://localhost:3333/api';

// Helper function for API calls
export const fetchFromAPI = async (endpoint, options = {}) => {
	const url = `${API_URL}${endpoint}`;
	const response = await fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({
			error: 'An error occurred',
		}));
		throw new Error(error.message || 'API request failed');
	}

	return response.json();
};
