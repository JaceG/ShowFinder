import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333/api';

export const searchEvents = async (city) => {
	try {
		console.log('Making request to:', `${API_BASE_URL}/events/search`);
		const response = await axios.get(`${API_BASE_URL}/events/search`, {
			params: { city },
		});
		console.log('Response received:', response.data);
		return response.data;
	} catch (error) {
		console.error('API Error:', {
			message: error.message,
			response: error.response?.data,
			status: error.response?.status,
		});
		throw error;
	}
};
