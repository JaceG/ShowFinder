import { useState } from 'react';
import { searchEvents } from './api/eventbriteApi';
import {
	Container,
	TextField,
	Button,
	Card,
	CardContent,
	CardMedia,
	Typography,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
} from '@mui/material';

function App() {
	const [city, setCity] = useState('');
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [sortBy, setSortBy] = useState('date');
	const [genreFilter, setGenreFilter] = useState('all');

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			console.log('Searching for events in:', city);
			const data = await searchEvents(city);
			setEvents(data.events || []);
		} catch (err) {
			console.error('Search error:', err);
			setError(err.response?.data?.error || 'Failed to fetch events');
		} finally {
			setLoading(false);
		}
	};

	// Filter and sort events
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

	return (
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

			<Box component='form' onSubmit={handleSearch} sx={{ mb: 4 }}>
				<Grid
					container
					spacing={2}
					alignItems='center'
					justifyContent='center'>
					<Grid item xs={12} sm={6} md={4}>
						<TextField
							fullWidth
							value={city}
							onChange={(e) => setCity(e.target.value)}
							placeholder='Enter city name'
							label='City'
							variant='outlined'
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={2}>
						<FormControl fullWidth>
							<InputLabel>Genre</InputLabel>
							<Select
								value={genreFilter}
								onChange={(e) => setGenreFilter(e.target.value)}
								label='Genre'>
								<MenuItem value='all'>All Genres</MenuItem>
								<MenuItem value='rock'>Rock</MenuItem>
								<MenuItem value='pop'>Pop</MenuItem>
								<MenuItem value='jazz'>Jazz</MenuItem>
								<MenuItem value='classical'>Classical</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={2}>
						<FormControl fullWidth>
							<InputLabel>Sort By</InputLabel>
							<Select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								label='Sort By'>
								<MenuItem value='date'>Date</MenuItem>
								<MenuItem value='name'>Name</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={2}>
						<Button
							fullWidth
							type='submit'
							variant='contained'
							disabled={loading}
							size='large'>
							{loading ? 'Searching...' : 'Search'}
						</Button>
					</Grid>
				</Grid>
			</Box>

			{error && (
				<Typography color='error' sx={{ mb: 2 }}>
					Error: {error}
				</Typography>
			)}

			{loading && <Typography align='center'>Loading...</Typography>}

			<Grid container spacing={3}>
				{filteredEvents.map((event) => (
					<Grid item xs={12} sm={6} md={4} key={event.id}>
						<Card
							sx={{
								height: '100%',
								display: 'flex',
								flexDirection: 'column',
							}}>
							<CardMedia
								component='img'
								height='200'
								image={
									event.images?.[0]?.url ||
									'https://via.placeholder.com/400x200?text=No+Image'
								}
								alt={event.name}
							/>
							<CardContent sx={{ flexGrow: 1 }}>
								<Typography
									gutterBottom
									variant='h5'
									component='h2'>
									{event.name}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									gutterBottom>
									{new Date(
										event.dates.start.localDate
									).toLocaleDateString()}{' '}
									at {event.dates.start.localTime || 'TBA'}
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									gutterBottom>
									{event._embedded?.venues?.[0]?.name}
								</Typography>
								{event.priceRanges && (
									<Typography
										variant='body2'
										color='text.secondary'>
										Price: ${event.priceRanges[0].min} - $
										{event.priceRanges[0].max}
									</Typography>
								)}
								<Button
									href={event.url}
									target='_blank'
									rel='noopener noreferrer'
									variant='contained'
									sx={{ mt: 2 }}
									fullWidth>
									Get Tickets
								</Button>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			{!loading && !error && filteredEvents.length === 0 && (
				<Typography align='center'>No events found</Typography>
			)}
		</Container>
	);
}

export default App;
