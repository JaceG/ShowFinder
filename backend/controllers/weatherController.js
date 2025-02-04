const axios = require('axios');
const config = require('../config/config');

const getWeather = async (req, res) => {
	try {
		const { lat, lon, date } = req.query;

		if (!lat || !lon) {
			return res
				.status(400)
				.json({ error: 'Latitude and longitude are required' });
		}

		if (!config.weather.apiKey) {
			return res
				.status(500)
				.json({ error: 'Weather API key is not configured' });
		}

		// Get 5-day forecast
		const response = await axios.get(
			'https://api.openweathermap.org/data/2.5/forecast',
			{
				params: {
					lat: lat,
					lon: lon,
					appid: config.weather.apiKey,
					units: 'imperial', // Use Fahrenheit
				},
			}
		);

		// Find forecast closest to event date
		const eventDate = new Date(date);
		const forecasts = response.data.list;

		// Filter forecasts to find ones closest to event date
		const relevantForecasts = forecasts.filter((forecast) => {
			const forecastDate = new Date(forecast.dt * 1000);
			const timeDiff = Math.abs(forecastDate - eventDate);
			return timeDiff < 24 * 60 * 60 * 1000; // Within 24 hours
		});

		res.json({
			forecasts: relevantForecasts.map((forecast) => ({
				datetime: new Date(forecast.dt * 1000).toISOString(),
				temp: forecast.main.temp,
				feels_like: forecast.main.feels_like,
				description: forecast.weather[0].description,
				icon: forecast.weather[0].icon,
				precipitation: forecast.pop * 100, // Probability of precipitation as percentage
				humidity: forecast.main.humidity,
				wind_speed: forecast.wind.speed,
			})),
		});
	} catch (error) {
		console.error(
			'Weather API Error:',
			error.response?.data || error.message
		);
		res.status(500).json({
			error: 'Failed to fetch weather data',
			details: error.response?.data || error.message,
		});
	}
};

module.exports = {
	getWeather,
};
