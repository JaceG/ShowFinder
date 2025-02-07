import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { searchEvents, saveEvent, getSavedEvents, unsaveEvent } from './api/ticketmasterApi';
import EventDetails from './components/EventDetails';
import Navigation from './components/Navigation';
import Login from './components/Login';
import SignUp from './components/SignUp';
import SavedEvents from './components/SavedEvents';
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
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useTheme } from './context/ThemeContext';
import EventCard from './components/EventCard';

function EventsPage() {
	const [city, setCity] = useState('');
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [sortBy, setSortBy] = useState('date');
	const [genreFilter, setGenreFilter] = useState('all');
	const [expanded, setExpanded] = useState({});
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [savedEventIds, setSavedEventIds] = useState(new Set());
	const { mode, toggleColorMode } = useTheme();

	useEffect(() => {
		const loadSavedEvents = async () => {
			try {
				const { savedEvents } = await getSavedEvents();
				setSavedEventIds(new Set(savedEvents.map(event => event.eventId)));
			} catch (error) {
				console.error('Error loading saved events:', error);
			}
		};

		if (localStorage.getItem('token')) {
			loadSavedEvents();
		}
	}, []);

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

	const handleSaveToggle = async (event) => {
		if (!localStorage.getItem('token')) {
			alert('Please log in to save events');
			return;
		}
		
		try {
			console.log('Toggling save for event:', event); // Debug log
			if (savedEventIds.has(event.id)) {
				console.log('Unsaving event:', event.id); // Debug log
				await unsaveEvent(event.id);
				setSavedEventIds(prev => {
					const newSet = new Set(prev);
					newSet.delete(event.id);
					return newSet;
				});
			} else {
				console.log('Saving event:', event); // Debug log
				const response = await saveEvent(event);
				console.log('Save response:', response); // Debug log
				setSavedEventIds(prev => new Set([...prev, event.id]));
			}
		} catch (error) {
			console.error('Failed to toggle event save:', error);
			alert(error.message || 'Failed to save/unsave event');
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
					sx={{
						position: 'fixed',
						top: 16,
						right: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 48,
					  }}>
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
							<EventCard 
								event={event}
								saved={savedEventIds.has(event.id)}
								onSaveToggle={handleSaveToggle}
								onExpandClick={handleExpandClick}
								expanded={expanded[event.id]}
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

function App() {
	return (
		<Router>
			<Navigation />
			<Routes>
				<Route path="/" element={<EventsPage />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/saved-events" element={<SavedEvents />} />
			</Routes>
		</Router>
	);
}

export default App;
