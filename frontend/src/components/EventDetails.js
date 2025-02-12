import { useState, useEffect } from 'react';
import {
	Container,
	Typography,
	Box,
	Card,
	CardMedia,
	Grid,
	Button,
	CircularProgress,
	Alert,
} from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WeatherWidget from './WeatherWidget';
import VenueMap from './VenueMap';
import SpotifyTracks from './SpotifyTracks';
import SpotifyArtistInfo from './SpotifyArtistInfo';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { searchYouTubeVideos } from '../api/googleApi';
import { searchSpotifyArtist } from '../api/spotifyApi';

function EventDetails({ event, onBack }) {
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [spotifyArtistId, setSpotifyArtistId] = useState(null);

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const videos = await searchYouTubeVideos(event.name);
				setVideos(videos);
			} catch (err) {
				setError(err.message || 'Failed to load videos');
			} finally {
				setLoading(false);
			}
		};

		fetchVideos();
	}, [event.name]);

	useEffect(() => {
		const fetchSpotifyArtist = async () => {
			try {
				const artistId = await searchSpotifyArtist(event.name);
				if (artistId) {
					setSpotifyArtistId(artistId);
				}
			} catch (err) {
				console.error('Error fetching Spotify artist:', err);
				// Don't set error state as this is optional
			}
		};

		fetchSpotifyArtist();
	}, [event.name]);

	return (
		<Container maxWidth='lg' sx={{ py: 4 }}>
			<Typography variant='h4' gutterBottom>
				{event.name}
			</Typography>

			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					{/* Event Details */}
					<Card sx={{ mb: 3 }}>
						<CardMedia
							component='img'
							height='300'
							image={
								event.images?.[0]?.url ||
								'https://via.placeholder.com/400x300'
							}
							alt={event.name}
						/>
						<Box sx={{ p: 2 }}>
							<Typography variant='h6'>{event.name}</Typography>
							<Typography variant='body1'>
								{new Date(
									event.dates.start.localDate
								).toLocaleDateString()}
							</Typography>
							<Typography variant='body2' gutterBottom>
								{event._embedded?.venues?.[0]?.name}
							</Typography>

							{/* Add Ticket Purchase Button */}
							{event.url && (
								<Button
									variant='contained'
									color='primary'
									startIcon={<ShoppingCartIcon />}
									href={event.url}
									target='_blank'
									rel='noopener noreferrer'
									fullWidth
									sx={{ mt: 2 }}>
									Buy Tickets
								</Button>
							)}

							{/* Add Price Range if available */}
							{event.priceRanges && (
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{ mt: 1 }}>
									Price Range: ${event.priceRanges[0]?.min} -
									${event.priceRanges[0]?.max}
								</Typography>
							)}
						</Box>
					</Card>

					{/* Spotify Artist Info */}
					{spotifyArtistId && (
						<SpotifyArtistInfo artistId={spotifyArtistId} />
					)}

					{/* Weather Widget */}
					{event._embedded?.venues?.[0] && (
						<WeatherWidget
							venue={event._embedded.venues[0]}
							eventDate={event.dates.start.localDate}
						/>
					)}

					{/* Venue Map */}
					{event._embedded?.venues?.[0] && (
						<VenueMap venue={event._embedded.venues[0]} />
					)}
				</Grid>

				<Grid item xs={12} md={6}>
					{/* Spotify Tracks */}
					<SpotifyTracks artistName={event.name} />

					{/* YouTube Videos */}
					<Typography variant='h6' gutterBottom>
						<YouTubeIcon sx={{ mr: 1 }} />
						Related Videos
					</Typography>

					{loading && <CircularProgress />}

					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					{!loading && !error && videos.length === 0 && (
						<Alert severity='info'>No videos found</Alert>
					)}

					{videos.map((video) => (
						<Card key={video.id} sx={{ mb: 2 }}>
							<CardMedia
								component='iframe'
								height='215'
								src={`https://www.youtube.com/embed/${video.id}`}
								title={video.title}
								sx={{ border: 0 }}
							/>
						</Card>
					))}
				</Grid>
			</Grid>

			<Box sx={{ mt: 3 }}>
				<Button variant='outlined' onClick={onBack}>
					Back to Search
				</Button>
			</Box>
		</Container>
	);
}

export default EventDetails;
