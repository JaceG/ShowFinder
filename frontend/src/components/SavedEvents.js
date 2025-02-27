import React, { useEffect, useState } from 'react';
import { getSavedEvents, unsaveEvent } from '../api/ticketmasterApi';
import { Container, Typography, Grid } from '@mui/material';
import EventCard from './EventCard';

function SavedEvents() {
	const [savedEvents, setSavedEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const loadSavedEvents = async () => {
		try {
			const data = await getSavedEvents();
			setSavedEvents(data || []);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadSavedEvents();
	}, []);

	const handleSaveToggle = async (event) => {
		try {
			await unsaveEvent(event.id);
			setSavedEvents((prev) =>
				prev.filter((e) => e.eventId !== event.id)
			);
		} catch (error) {
			console.error('Error unsaving event:', error);
		}
	};

	if (loading)
		return (
			<Container maxWidth='lg' sx={{ py: 4 }}>
				<Typography>Loading...</Typography>
			</Container>
		);

	if (error)
		return (
			<Container maxWidth='lg' sx={{ py: 4 }}>
				<Typography color='error'>{error}</Typography>
			</Container>
		);

	return (
		<Container maxWidth='lg' sx={{ py: 4 }}>
			<Typography variant='h4' gutterBottom>
				Saved Events
			</Typography>
			<Grid container spacing={3}>
				{savedEvents.map((event) => (
					<Grid item xs={12} sm={6} md={4} key={event.eventId}>
						<EventCard
							event={{
								...event.eventData,
								id: event.eventId,
							}}
							saved={true}
							onSaveToggle={handleSaveToggle}
						/>
					</Grid>
				))}
			</Grid>
			{savedEvents.length === 0 && (
				<Typography align='center'>No saved events yet</Typography>
			)}
		</Container>
	);
}

export default SavedEvents;
