const express = require('express');
const router = express.Router();
const {
	searchArtist,
	getArtistConcerts,
} = require('../controllers/spotifyController');

router.get('/search', searchArtist);
router.get('/concerts', getArtistConcerts);

module.exports = router;
