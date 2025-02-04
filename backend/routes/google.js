const express = require('express');
const router = express.Router();
const { searchYouTube } = require('../controllers/googleController');

router.get('/youtube', searchYouTube);
// We can add other Google routes here later

module.exports = router;
