import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	Typography,
	Box,
	CircularProgress,
	Alert,
	IconButton,
	Link,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const API_URL =
	process.env.NODE_ENV === 'production'
		? '/api'
		: 'http://localhost:3333/api';

function SpotifyTracks({ artistName }) {
	const [tracks, setTracks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [playing, setPlaying] = useState(null);
	const [audio, setAudio] = useState(null);

	useEffect(() => {
		const fetchTracks = async () => {
			try {
				const response = await fetch(
					`${API_URL}/spotify/search?q=${encodeURIComponent(
						artistName
					)}`
				);

				if (!response.ok) {
					throw new Error('Failed to fetch tracks');
				}

				const data = await response.json();
				setTracks(data.tracks || []);
			} catch (err) {
				console.error('Error fetching tracks:', err);
				setError('Failed to load tracks');
			} finally {
				setLoading(false);
			}
		};

		fetchTracks();

		// Cleanup audio on unmount
		return () => {
			if (audio) {
				audio.pause();
				audio.src = '';
			}
		};
	}, [artistName]);

	const handlePlay = (track) => {
		if (!track.previewUrl) return;

		if (playing === track.id) {
			audio.pause();
			setPlaying(null);
		} else {
			if (audio) {
				audio.pause();
			}
			const newAudio = new Audio(track.previewUrl);
			newAudio.play();
			newAudio.onended = () => setPlaying(null);
			setAudio(newAudio);
			setPlaying(track.id);
		}
	};

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity='error'>{error}</Alert>;
	if (tracks.length === 0)
		return <Alert severity='info'>No tracks found</Alert>;

	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				<Typography
					variant='h6'
					gutterBottom
					sx={{ display: 'flex', alignItems: 'center' }}>
					<MusicNoteIcon sx={{ mr: 1 }} />
					Top Tracks
				</Typography>

				{tracks.map((track) => (
					<Box
						key={track.id}
						sx={{
							display: 'flex',
							alignItems: 'center',
							mb: 2,
							p: 1,
							borderRadius: 1,
							'&:hover': { bgcolor: 'action.hover' },
						}}>
						<Box
							component='img'
							src={track.albumArt}
							alt={track.name}
							sx={{
								width: 50,
								height: 50,
								mr: 2,
								borderRadius: 1,
							}}
						/>

						<Box sx={{ flexGrow: 1 }}>
							<Typography variant='body1'>
								{track.name}
							</Typography>
						</Box>

						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							{track.previewUrl && (
								<IconButton
									onClick={() => handlePlay(track)}
									color={
										playing === track.id
											? 'primary'
											: 'default'
									}>
									{playing === track.id ? (
										<PauseIcon />
									) : (
										<PlayArrowIcon />
									)}
								</IconButton>
							)}

							<IconButton
								component={Link}
								href={track.spotifyUrl}
								target='_blank'
								rel='noopener noreferrer'>
								<OpenInNewIcon />
							</IconButton>
						</Box>
					</Box>
				))}
			</CardContent>
		</Card>
	);
}

export default SpotifyTracks;
