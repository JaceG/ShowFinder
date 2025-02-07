import React from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Chip,
    CardActions,
    Button,
    IconButton,
    Collapse
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function EventCard({ event, saved = false, onSaveToggle, onExpandClick, expanded, onMoreDetails }) {
    const handleSaveClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!localStorage.getItem('token')) {
            alert('Please log in to save events');
            return;
        }
        onSaveToggle(event);
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="200"
                image={event.images?.[0]?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
                alt={event.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {event.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon sx={{ mr: 1, fontSize: 'small' }} />
                    <Typography variant="body2" color="text.secondary">
                        {new Date(event.dates.start.localDate).toLocaleDateString()} at{' '}
                        {event.dates.start.localTime || 'TBA'}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1, fontSize: 'small' }} />
                    <Typography variant="body2" color="text.secondary">
                        {event._embedded?.venues?.[0]?.name}, {event._embedded?.venues?.[0]?.city?.name}
                    </Typography>
                </Box>
                <Box sx={{ mt: 2, mb: 1 }}>
                    {event.classifications?.[0]?.genre && (
                        <Chip
                            label={event.classifications[0].genre.name}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                        />
                    )}
                    {event.family && (
                        <Chip
                            icon={<FamilyRestroomIcon />}
                            label="Family Friendly"
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                        />
                    )}
                </Box>
                {event.priceRanges && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocalOfferIcon sx={{ mr: 1, fontSize: 'small' }} />
                        <Typography variant="body2" color="text.secondary">
                            ${event.priceRanges[0].min} - ${event.priceRanges[0].max}
                        </Typography>
                    </Box>
                )}
            </CardContent>
            <CardActions>
                <Button
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    size="small"
                >
                    Get Tickets
                </Button>
                {onMoreDetails && (
                    <Button
                        onClick={() => onMoreDetails(event)}
                        variant="outlined"
                        size="small"
                    >
                        More Details
                    </Button>
                )}
                <IconButton 
                    onClick={handleSaveClick}
                    color={saved ? "error" : "default"}
                    aria-label={saved ? "unsave event" : "save event"}
                >
                    {saved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                {onExpandClick && (
                    <IconButton
                        onClick={() => onExpandClick(event.id)}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                )}
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {event.pleaseNote && (
                        <Typography paragraph>
                            <strong>Note:</strong> {event.pleaseNote}
                        </Typography>
                    )}
                    {event._embedded?.venues?.[0]?.generalInfo && (
                        <Typography paragraph>
                            <strong>Venue Info:</strong>{' '}
                            {event._embedded.venues[0].generalInfo.generalRule}
                        </Typography>
                    )}
                    {event._embedded?.venues?.[0]?.parkingDetail && (
                        <Typography paragraph>
                            <strong>Parking:</strong>{' '}
                            {event._embedded.venues[0].parkingDetail}
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
    );
}

export default EventCard; 