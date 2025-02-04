import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	Typography,
	Box,
	CircularProgress,
	Alert,
	Divider,
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import UmbrellaIcon from '@mui/icons-material/BeachAccess';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const API_URL =
	process.env.NODE_ENV === 'production'
		? '/api'
		: 'http://localhost:3333/api';

function WeatherWidget({ venue, eventDate }) {
	const [weather, setWeather] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Format the event date
	const formattedDate = new Date(eventDate).toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	});

	useEffect(() => {
		const fetchWeather = async () => {
			if (!venue?.location?.latitude || !venue?.location?.longitude) {
				setError('Venue location not available');
				setLoading(false);
				return;
			}

			try {
				const response = await fetch(
					`${API_URL}/weather?lat=${venue.location.latitude}&lon=${venue.location.longitude}&date=${eventDate}`
				);

				if (!response.ok) {
					throw new Error('Failed to fetch weather data');
				}

				const data = await response.json();
				setWeather(data.forecasts[0]); // Get the first (closest) forecast
			} catch (err) {
				setError('Could not load weather forecast');
				console.error('Weather fetch error:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchWeather();
	}, [venue, eventDate]);

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity='info'>{error}</Alert>;
	if (!weather) return null;

	// Calculate days until event
	const daysUntil = Math.ceil(
		(new Date(eventDate) - new Date()) / (1000 * 60 * 60 * 24)
	);
	let forecastMessage;
	if (daysUntil > 5) {
		forecastMessage = 'Extended forecast - subject to change';
	} else if (daysUntil > 0) {
		forecastMessage = `${daysUntil} day${
			daysUntil === 1 ? '' : 's'
		} until event`;
	} else {
		forecastMessage = "Today's forecast";
	}

	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				<Typography
					variant='h6'
					gutterBottom
					sx={{ display: 'flex', alignItems: 'center' }}>
					<WbSunnyIcon sx={{ mr: 1 }} />
					Event Day Weather Forecast
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<CalendarTodayIcon
						sx={{ mr: 1, color: 'text.secondary' }}
					/>
					<Typography color='text.secondary'>
						{formattedDate}
					</Typography>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					<img
						src={`https://openweathermap.org/img/w/${weather.icon}.png`}
						alt={weather.description}
						style={{
							marginRight: '8px',
							width: '50px',
							height: '50px',
						}}
					/>
					<Box>
						<Typography variant='h4'>
							{Math.round(weather.temp)}°F
						</Typography>
						<Typography
							variant='body1'
							sx={{ textTransform: 'capitalize' }}>
							{weather.description}
						</Typography>
					</Box>
				</Box>

				<Typography
					variant='body2'
					color='text.secondary'
					sx={{ mb: 1 }}>
					Feels like: {Math.round(weather.feels_like)}°F
				</Typography>

				{weather.precipitation > 0 && (
					<Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
						<UmbrellaIcon sx={{ mr: 1, color: 'primary.main' }} />
						<Typography color='primary'>
							{Math.round(weather.precipitation)}% chance of rain
						</Typography>
					</Box>
				)}

				<Alert severity='info' sx={{ mt: 2 }}>
					{forecastMessage}
				</Alert>
			</CardContent>
		</Card>
	);
}

export default WeatherWidget;
