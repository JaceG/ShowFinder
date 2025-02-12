import React, { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	Typography,
	Box,
	CircularProgress,
	Alert,
	IconButton,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const API_URL =
	process.env.NODE_ENV === 'production'
		? '/api'
		: 'http://localhost:3333/api';

const SpotifyTracks = ({ artistName }) => {
	const [tracks, setTracks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [playing, setPlaying] = useState(null);

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
				const tracksList = data.tracks?.items || [];
				setTracks(tracksList);
			} catch (error) {
				console.error('Error fetching tracks:', error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (artistName) {
			fetchTracks();
		}
	}, [artistName]);

	const handlePlay = (trackId, previewUrl) => {
		if (playing === trackId) {
			// Stop playing
			const audio = document.getElementById(`audio-${trackId}`);
			audio.pause();
			setPlaying(null);
		} else {
			// Stop any currently playing audio
			if (playing) {
				const currentAudio = document.getElementById(
					`audio-${playing}`
				);
				currentAudio.pause();
			}
			// Start playing new track
			const audio = document.getElementById(`audio-${trackId}`);
			audio.play();
			setPlaying(trackId);
		}
	};

	if (loading) return <CircularProgress />;
	if (error) return <Alert severity='error'>{error}</Alert>;
	if (!tracks || tracks.length === 0)
		return (
			<Box display='flex' alignItems='center' gap={1}>
				<MusicNoteIcon />
				<Typography>No tracks found</Typography>
			</Box>
		);

	return (
		<Box sx={{ mb: 4 }}>
			<Typography
				variant='h6'
				gutterBottom
				sx={{ display: 'flex', alignItems: 'center' }}>
				<MusicNoteIcon sx={{ mr: 1 }} />
				Top Tracks
			</Typography>
			{tracks.map((track) => (
				<Card key={track.id} sx={{ mb: 2 }}>
					<CardContent>
						<Box display='flex' alignItems='center' gap={2}>
							{track.album?.images?.[0] && (
								<Box
									component='img'
									src={track.album.images[0].url}
									sx={{
										width: 60,
										height: 60,
										borderRadius: 1,
									}}
									alt={track.album.name}
								/>
							)}
							<Box flex={1}>
								<Typography variant='subtitle1'>
									{track.name}
								</Typography>
								<Typography
									variant='body2'
									color='textSecondary'>
									Album: {track.album?.name}
								</Typography>
							</Box>
							<Box display='flex' alignItems='center' gap={1}>
								{track.preview_url && (
									<>
										<IconButton
											onClick={() =>
												handlePlay(
													track.id,
													track.preview_url
												)
											}
											size='small'
											sx={{ color: 'primary.main' }}>
											{playing === track.id ? (
												<PauseIcon />
											) : (
												<PlayArrowIcon />
											)}
										</IconButton>
										<audio
											id={`audio-${track.id}`}
											src={track.preview_url}
											onEnded={() => setPlaying(null)}
										/>
									</>
								)}
								{track.external_urls?.spotify && (
									<IconButton
										size='small'
										href={track.external_urls.spotify}
										target='_blank'
										rel='noopener noreferrer'
										sx={{ color: 'primary.main' }}>
										<OpenInNewIcon />
									</IconButton>
								)}
							</Box>
						</Box>
					</CardContent>
				</Card>
			))}
		</Box>
	);
};

export default SpotifyTracks;
