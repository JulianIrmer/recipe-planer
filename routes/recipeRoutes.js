const express = require('express');
const router = express.Router();
const recipesController = require('../controller/recipeController');

// Render Methods
router.get('/', recipesController.render);
router.get('/update', recipesController.renderUpdate);
router.get('/add', recipesController.renderAdd);

// API Methods
router.get('/api', recipesController.get);
router.post('/api', recipesController.add);
router.patch('/api', recipesController.update);
router.delete('/api', recipesController.delete);

module.exports = router;