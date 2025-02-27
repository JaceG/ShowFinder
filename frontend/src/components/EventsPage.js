import { useState, useEffect } from 'react';
import {
	searchEvents,
	saveEvent,
	getSavedEvents,
	unsaveEvent,
} from '../api/ticketmasterApi';
import EventDetails from './EventDetails';
import SearchForm from './SearchForm';
import { Container, Typography, Grid, Box } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import EventCard from './EventCard';

function EventsPage() {
	const [city, setCity] = useState('');
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [sortBy, setSortBy] = useState('date');
	const [genreFilter, setGenreFilter] = useState('all');
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [savedEventIds, setSavedEventIds] = useState(new Set());
	const { mode, toggleColorMode } = useTheme();

	useEffect(() => {
		const loadSavedEvents = async () => {
			try {
				const savedEvents = await getSavedEvents();
				setSavedEventIds(
					new Set(savedEvents.map((event) => event.eventId))
				);
			} catch (error) {
				console.error('Error loading saved events:', error);
			}
		};

		if (localStorage.getItem('token')) {
			loadSavedEvents();
		}
	}, []);

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const data = await searchEvents(city);
			setEvents(data.events || []);
		} catch (err) {
			setError(err.response?.data?.error || 'Failed to fetch events');
		} finally {
			setLoading(false);
		}
	};

	const handleSaveToggle = async (event) => {
		if (!localStorage.getItem('token')) {
			alert('Please log in to save events');
			return;
		}

		try {
			if (savedEventIds.has(event.id)) {
				await unsaveEvent(event.id);
				setSavedEventIds((prev) => {
					const newSet = new Set(prev);
					newSet.delete(event.id);
					return newSet;
				});
			} else {
				await saveEvent(event);
				setSavedEventIds((prev) => new Set([...prev, event.id]));
			}
		} catch (error) {
			console.error('Failed to toggle event save:', error);
			alert(error.message || 'Failed to save/unsave event');
		}
	};

	const filteredEvents = events
		.filter((event) => {
			if (genreFilter === 'all') return true;
			return (
				event.classifications?.[0]?.genre?.name.toLowerCase() ===
				genreFilter.toLowerCase()
			);
		})
		.sort((a, b) => {
			if (sortBy === 'date') {
				return (
					new Date(a.dates.start.localDate) -
					new Date(b.dates.start.localDate)
				);
			}
			return 0;
		});

	if (selectedEvent) {
		return (
			<EventDetails
				event={selectedEvent}
				onBack={() => setSelectedEvent(null)}
			/>
		);
	}

	return (
		<Box
			sx={{
				bgcolor: 'background.default',
				minHeight: '100vh',
				color: 'text.primary',
			}}>
			<Container maxWidth='lg' sx={{ py: 4 }}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						mb: 3,
					}}>
					<img
						src='/logo512.png'
						alt='ShowFinder Logo'
						style={{
							width: '120px',
							height: '120px',
							marginBottom: '1rem',
							filter: mode === 'dark' ? 'invert(1)' : 'none',
						}}
					/>
					<Typography
						variant='h2'
						component='h1'
						gutterBottom
						align='center'>
						ShowFinder
					</Typography>
				</Box>

				<SearchForm
					city={city}
					setCity={setCity}
					genreFilter={genreFilter}
					setGenreFilter={setGenreFilter}
					sortBy={sortBy}
					setSortBy={setSortBy}
					loading={loading}
					handleSearch={handleSearch}
				/>

				{error && (
					<Typography color='error' sx={{ mb: 2 }}>
						Error: {error}
					</Typography>
				)}

				{loading && <Typography align='center'>Loading...</Typography>}

				<Grid container spacing={3}>
					{filteredEvents.map((event) => (
						<Grid item xs={12} sm={6} md={4} key={event.id}>
							<EventCard
								event={event}
								saved={savedEventIds.has(event.id)}
								onSaveToggle={handleSaveToggle}
								onMoreDetails={setSelectedEvent}
							/>
						</Grid>
					))}
				</Grid>

				{!loading && !error && filteredEvents.length === 0 && (
					<Typography align='center'>No events found</Typography>
				)}
			</Container>
		</Box>
	);
}

export default EventsPage;
