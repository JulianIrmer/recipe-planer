const express = require('express');
const router = express.Router();
const planController = require('../controller/planController');

// Render Methods
router.get('/', planController.render);
router.get('/add', planController.renderAdd);
router.get('/:id', planController.renderPlanTile);

// API Methods
router.get('/api/addnewrecipe', planController.getNewRecipe);
router.post('/api', planController.add);
router.patch('/api', planController.update);
router.delete('/api', planController.delete);

module.exports = router;