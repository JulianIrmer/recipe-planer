const express = require('express');
const router = express.Router();
const homeController = require('../controller/home');

router.get('/render/home', homeController.renderHome);
router.get('/render/content', homeController.renderContent);
router.get('/render/recipeplan', homeController.renderRecipePlan);
router.get('/render/statistics', homeController.renderStatistics);
router.get('/render/settings', homeController.renderSettings);
router.get('/test/plan', homeController.generatePlan);

module.exports = router;