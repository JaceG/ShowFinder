import { API_URL } from './index';

const getWeatherForecast = async (lat, lon, date) => {
	try {
		const params = new URLSearchParams({
			lat: lat.toString(),
			lon: lon.toString(),
			date: date,
		});

		const response = await fetch(`${API_URL}/weather?${params}`);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Weather API error response:', errorText);
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching weather:', error);
		throw error;
	}
};

export { getWeatherForecast };
