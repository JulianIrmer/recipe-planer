const express = require('express');
const router = express.Router();
const statisticsController = require('../controller/statisticsController');

// Render Methods
router.get('/', statisticsController.render);

// API Methods

module.exports = router;