const express = require('express');
const router = express.Router();
const recipesController = require('../controller/recipes');

router.get('/', recipesController.get);
router.post('/', recipesController.add);
router.patch('/', recipesController.update);
router.delete('/', recipesController.delete);

module.exports = router;