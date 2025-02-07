import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { searchEvents } from './api/ticketmasterApi';
import EventDetails from './components/EventDetails';
import Navigation from './components/Navigation';
import Login from './components/Login';
import SignUp from './components/SignUp';
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
	Chip,
	CardActions,
	Collapse,
	IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from './context/ThemeContext';

function EventsPage() {
	const [city, setCity] = useState('');
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [sortBy, setSortBy] = useState('date');
	const [genreFilter, setGenreFilter] = useState('all');
	const [expanded, setExpanded] = useState({});
	const [selectedEvent, setSelectedEvent] = useState(null);
	const { mode, toggleColorMode } = useTheme();

	const handleExpandClick = (eventId) => {
		setExpanded({
			...expanded,
			[eventId]: !expanded[eventId],
		});
	};

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
				<IconButton
					onClick={toggleColorMode}
					color='inherit'
					sx={{ position: 'absolute', top: 16, right: 16 }}>
					<Brightness4Icon style={{ fill: '#000' }} />
				</IconButton>
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
									onChange={(e) =>
										setGenreFilter(e.target.value)
									}
									label='Genre'>
									<MenuItem value='all'>All Genres</MenuItem>
									<MenuItem value='rock'>Rock</MenuItem>
									<MenuItem value='pop'>Pop</MenuItem>
									<MenuItem value='jazz'>Jazz</MenuItem>
									<MenuItem value='classical'>
										Classical
									</MenuItem>
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
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											mb: 1,
										}}>
										<CalendarTodayIcon
											sx={{ mr: 1, fontSize: 'small' }}
										/>
										<Typography
											variant='body2'
											color='text.secondary'>
											{new Date(
												event.dates.start.localDate
											).toLocaleDateString()}{' '}
											at{' '}
											{event.dates.start.localTime ||
												'TBA'}
										</Typography>
									</Box>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											mb: 1,
										}}>
										<LocationOnIcon
											sx={{ mr: 1, fontSize: 'small' }}
										/>
										<Typography
											variant='body2'
											color='text.secondary'>
											{event._embedded?.venues?.[0]?.name}
											,{' '}
											{
												event._embedded?.venues?.[0]
													?.city?.name
											}
										</Typography>
									</Box>
									<Box sx={{ mt: 2, mb: 1 }}>
										{event.classifications?.[0]?.genre && (
											<Chip
												label={
													event.classifications[0]
														.genre.name
												}
												size='small'
												sx={{ mr: 0.5, mb: 0.5 }}
											/>
										)}
										{event.family && (
											<Chip
												icon={<FamilyRestroomIcon />}
												label='Family Friendly'
												size='small'
												sx={{ mr: 0.5, mb: 0.5 }}
											/>
										)}
									</Box>
									{event.priceRanges && (
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												mb: 1,
											}}>
											<LocalOfferIcon
												sx={{
													mr: 1,
													fontSize: 'small',
												}}
											/>
											<Typography
												variant='body2'
												color='text.secondary'>
												${event.priceRanges[0].min} - $
												{event.priceRanges[0].max}
											</Typography>
										</Box>
									)}
								</CardContent>
								<CardActions>
									<Button
										href={event.url}
										target='_blank'
										rel='noopener noreferrer'
										variant='contained'
										size='small'>
										Get Tickets
									</Button>
									<Button
										onClick={() => setSelectedEvent(event)}
										variant='outlined'
										size='small'>
										More Details
									</Button>
									<IconButton
										onClick={() =>
											handleExpandClick(event.id)
										}
										aria-expanded={expanded[event.id]}
										aria-label='show more'>
										<ExpandMoreIcon />
									</IconButton>
								</CardActions>
								<Collapse
									in={expanded[event.id]}
									timeout='auto'
									unmountOnExit>
									<CardContent>
										{event.pleaseNote && (
											<Typography paragraph>
												<strong>Note:</strong>{' '}
												{event.pleaseNote}
											</Typography>
										)}
										{event._embedded?.venues?.[0]
											?.generalInfo && (
											<Typography paragraph>
												<strong>Venue Info:</strong>{' '}
												{
													event._embedded.venues[0]
														.generalInfo.generalRule
												}
											</Typography>
										)}
										{event._embedded?.venues?.[0]
											?.parkingDetail && (
											<Typography paragraph>
												<strong>Parking:</strong>{' '}
												{
													event._embedded.venues[0]
														.parkingDetail
												}
											</Typography>
										)}
										{event.accessibility && (
											<Typography paragraph>
												<strong>Accessibility:</strong>{' '}
												{event.accessibility.info}
											</Typography>
										)}
									</CardContent>
								</Collapse>
							</Card>
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

function App() {
	return (
		<Router>
			<Navigation />
			<Routes>
				<Route path="/" element={<EventsPage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
			</Routes>
		</Router>
	);
}

export default App;
