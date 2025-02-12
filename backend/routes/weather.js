const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config/config');

router.get('/', async (req, res) => {
	try {
		const { lat, lon, date } = req.query;
		console.log('Weather request:', { lat, lon, date });

		if (!lat || !lon) {
			return res
				.status(400)
				.json({ error: 'Latitude and longitude are required' });
		}

		// For dates beyond 5 days, use different endpoint
		const isDateBeyond5Days =
			date && new Date(date) - new Date() > 5 * 24 * 60 * 60 * 1000;

		let response;
		if (isDateBeyond5Days) {
			// Use climate data for dates beyond 5 days
			response = await axios.get(
				'https://api.openweathermap.org/data/2.5/weather',
				{
					params: {
						lat: lat,
						lon: lon,
						appid: config.apis.openweather,
						units: 'imperial',
					},
				}
			);

			// Format response for consistency
			const formattedData = {
				location: {
					name: response.data.name,
					coord: response.data.coord,
				},
				forecast: [
					{
						datetime: new Date(date).toISOString(),
						temp: response.data.main.temp,
						feels_like: response.data.main.feels_like,
						description: response.data.weather[0].description,
						icon: response.data.weather[0].icon,
						precipitation: 0, // Historical average not available
						humidity: response.data.main.humidity,
						wind_speed: response.data.wind.speed,
					},
				],
			};

			return res.json(formattedData);
		}

		// For dates within 5 days, use forecast
		response = await axios.get(
			'https://api.openweathermap.org/data/2.5/forecast',
			{
				params: {
					lat: lat,
					lon: lon,
					appid: config.apis.openweather,
					units: 'imperial',
				},
			}
		);

		const forecasts = response.data.list;
		let relevantForecasts = forecasts;

		if (date) {
			const targetDate = new Date(date).toISOString().split('T')[0];
			relevantForecasts = forecasts.filter((forecast) => {
				const forecastDate = new Date(forecast.dt * 1000)
					.toISOString()
					.split('T')[0];
				return forecastDate === targetDate;
			});
		}

		// If no forecasts found for the date, use current weather
		if (relevantForecasts.length === 0 && date) {
			relevantForecasts = [forecasts[0]]; // Use the first available forecast
		}

		const formattedData = {
			location: response.data.city,
			forecast: relevantForecasts.map((forecast) => ({
				datetime: new Date(forecast.dt * 1000).toISOString(),
				temp: forecast.main.temp,
				feels_like: forecast.main.feels_like,
				description: forecast.weather[0].description,
				icon: forecast.weather[0].icon,
				precipitation: (forecast.pop || 0) * 100,
				humidity: forecast.main.humidity,
				wind_speed: forecast.wind.speed,
			})),
		};

		console.log('Sending weather data:', formattedData);
		res.json(formattedData);
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
});

module.exports = router;
