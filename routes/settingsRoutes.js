const express = require('express');
const router = express.Router();
const settingsController = require('../controller/settingsController');

// Render Methods
router.get('/', settingsController.render);

// API Methods

module.exports = router;