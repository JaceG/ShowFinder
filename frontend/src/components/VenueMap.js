import { useEffect, useState, useRef, useCallback } from 'react';
import {
	Box,
	Card,
	CardContent,
	Typography,
	Button,
	CircularProgress,
	Alert,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';

function VenueMap({ venue }) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const mapContainerRef = useRef(null);
	const scriptRef = useRef(null);
	const mapRef = useRef(null);

	const MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

	const initMap = useCallback(() => {
		if (!venue?.location?.latitude || !venue?.location?.longitude) {
			setError('Venue location not available');
			setLoading(false);
			return;
		}

		const tryInitMap = () => {
			try {
				if (
					!mapContainerRef.current ||
					!window.google ||
					!window.google.maps
				) {
					setTimeout(tryInitMap, 100); // Try again in 100ms
					return;
				}

				const location = {
					lat: parseFloat(venue.location.latitude),
					lng: parseFloat(venue.location.longitude),
				};

				// Create the map instance - use window.google instead of google
				mapRef.current = new window.google.maps.Map(
					mapContainerRef.current,
					{
						center: location,
						zoom: 15,
						mapTypeControl: false,
						fullscreenControl: false,
						streetViewControl: true,
					}
				);

				// Add marker - use window.google instead of google
				new window.google.maps.Marker({
					position: location,
					map: mapRef.current,
					title: venue.name,
				});

				setMapLoaded(true);
				setLoading(false);
			} catch (err) {
				console.error('Map initialization error:', err);
				setError('Error initializing map');
				setLoading(false);
			}
		};

		tryInitMap();
	}, [venue]);

	// Load Google Maps Script
	useEffect(() => {
		if (!MAPS_API_KEY) return;

		const loadGoogleMaps = () => {
			if (!window.google && !scriptRef.current) {
				window.initMap = () => {
					console.log('Google Maps loaded successfully');
					initMap();
				};

				const script = document.createElement('script');
				script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=initMap`;
				script.async = true;
				script.defer = true;
				script.onerror = (e) => {
					console.error('Google Maps script loading error:', e);
					setError('Failed to load Google Maps');
					setLoading(false);
				};
				document.head.appendChild(script);
				scriptRef.current = script;
			} else if (window.google && !mapLoaded) {
				initMap();
			}
		};

		loadGoogleMaps();

		return () => {
			if (scriptRef.current) {
				document.head.removeChild(scriptRef.current);
				scriptRef.current = null;
			}
			if (typeof window !== 'undefined') {
				window.initMap = undefined;
			}
		};
	}, [MAPS_API_KEY, initMap, mapLoaded]);

	// Hide error messages
	useEffect(() => {
		const style = document.createElement('style');
		style.textContent = `
			.gm-err-container,
			.gm-err-content,
			.gm-err-message,
			.gm-err-title {
				display: none !important;
			}
		`;
		document.head.appendChild(style);

		return () => {
			document.head.removeChild(style);
		};
	}, []);

	const getDirectionsUrl = () => {
		if (!venue?.location?.latitude || !venue?.location?.longitude)
			return '#';
		return `https://www.google.com/maps/dir/?api=1&destination=${venue.location.latitude},${venue.location.longitude}`;
	};

	if (error) {
		return (
			<Card sx={{ mb: 2 }}>
				<CardContent>
					<Alert severity='error'>
						{error}
						{!MAPS_API_KEY && ' (API key missing)'}
					</Alert>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				<Typography
					variant='h6'
					gutterBottom
					sx={{ display: 'flex', alignItems: 'center' }}>
					<LocationOnIcon sx={{ mr: 1 }} />
					Venue Location
				</Typography>

				<Box
					ref={mapContainerRef}
					sx={{
						height: 300,
						width: '100%',
						mb: 2,
						borderRadius: 1,
						overflow: 'hidden',
						bgcolor: 'grey.100',
					}}
				/>

				{loading && !mapLoaded && (
					<Box display='flex' justifyContent='center' my={2}>
						<CircularProgress />
					</Box>
				)}

				<Typography variant='body1' gutterBottom>
					{venue.name}
					{venue.address && `, ${venue.address.line1}`}
					{venue.city && `, ${venue.city.name}`}
					{venue.state && `, ${venue.state.stateCode}`}
				</Typography>

				<Button
					variant='contained'
					color='primary'
					startIcon={<DirectionsIcon />}
					href={getDirectionsUrl()}
					target='_blank'
					rel='noopener noreferrer'
					sx={{ mt: 1 }}>
					Get Directions
				</Button>
			</CardContent>
		</Card>
	);
}

export default VenueMap;
