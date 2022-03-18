const express = require('express');
const router = express.Router();
const homeController = require('../controller/home');

router.get('/', homeController.renderHome);
router.get('/content', homeController.renderContent);

module.exports = router;