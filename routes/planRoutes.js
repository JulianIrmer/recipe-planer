const express = require('express');
const router = express.Router();
const planController = require('../controller/planController');

// Render Methods
router.get('/', planController.render);
router.get('/add', planController.renderAdd);

// API Methods
router.post('/api', planController.add);
router.delete('/api', planController.delete);

module.exports = router;