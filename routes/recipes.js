const express = require('express');
const router = express.Router();
const recipesController = require('../controller/recipes');

router.get('/', recipesController.get);
router.post('/', recipesController.add);
router.patch('/', recipesController.update);
router.delete('/', recipesController.delete);

router.get('/renderupdateform', recipesController.renderUpdateForm);
router.get('/renderrecipetile', recipesController.renderRecipeTile);

module.exports = router;