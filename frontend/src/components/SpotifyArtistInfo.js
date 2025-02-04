import { useState, useEffect } from 'react';
import {
	Card,
	CardContent,
	Typography,
	Box,
	CircularProgress,
	Avatar,
	Chip,
	Grid,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AlbumIcon from '@mui/icons-material/Album';

const API_URL =
	process.env.NODE_ENV === 'production'
		? '/api'
		: 'http://localhost:3333/api';

function SpotifyArtistInfo({ artistId }) {
	const [artistInfo, setArtistInfo] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchArtistInfo = async () => {
			try {
				const response = await fetch(
					`${API_URL}/spotify/concerts?artistId=${encodeURIComponent(
						artistId
					)}`
				);

				if (response.status === 404) {
					setArtistInfo(null);
					setLoading(false);
					return;
				}

				if (!response.ok) {
					console.log(
						`Artist info fetch failed with status: ${response.status}`
					);
					setArtistInfo(null);
					setLoading(false);
					return;
				}

				const data = await response.json();
				setArtistInfo(data);
			} catch (err) {
				console.error('Error fetching artist info:', err);
				setArtistInfo(null);
			} finally {
				setLoading(false);
			}
		};

		if (artistId) {
			fetchArtistInfo();
		}
	}, [artistId]);

	if (!artistId || !artistInfo) return null;
	if (loading) return <CircularProgress />;

	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				<Typography
					variant='h6'
					gutterBottom
					sx={{ display: 'flex', alignItems: 'center' }}>
					<PersonIcon sx={{ mr: 1 }} />
					Artist Information
				</Typography>

				<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
					{artistInfo.artist.images?.[0] && (
						<Avatar
							src={artistInfo.artist.images[0].url}
							sx={{ width: 64, height: 64, mr: 2 }}
						/>
					)}
					<Box>
						<Typography variant='h6'>
							{artistInfo.artist.name}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							{artistInfo.artist.followers.toLocaleString()}{' '}
							followers
						</Typography>
					</Box>
				</Box>

				<Box sx={{ mb: 2 }}>
					<Typography variant='subtitle2' gutterBottom>
						Genres:
					</Typography>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
						{artistInfo.artist.genres.map((genre) => (
							<Chip key={genre} label={genre} size='small' />
						))}
					</Box>
				</Box>

				{artistInfo.relatedArtists.length > 0 && (
					<Box>
						<Typography variant='subtitle2' gutterBottom>
							Similar Artists:
						</Typography>
						<Grid container spacing={1}>
							{artistInfo.relatedArtists.map((artist) => (
								<Grid item xs={6} key={artist.id}>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: 1,
										}}>
										<AlbumIcon fontSize='small' />
										<Typography variant='body2'>
											{artist.name}
										</Typography>
									</Box>
								</Grid>
							))}
						</Grid>
					</Box>
				)}
			</CardContent>
		</Card>
	);
}

export default SpotifyArtistInfo;
