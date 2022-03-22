const express = require('express');
const router = express.Router();
const recipesController = require('../controller/recipeController');

// Render Methods
router.get('/', recipesController.render);
router.get('/update', recipesController.renderUpdate);
router.get('/add', recipesController.renderAdd);
router.get('/:id', recipesController.renderRecipe);

// API Methods
router.get('/api', recipesController.get);
router.post('/api', recipesController.add);
router.post('/api/update', recipesController.update);
router.delete('/api', recipesController.delete);

module.exports = router;