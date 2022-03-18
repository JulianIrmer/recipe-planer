const recipesController = require('./recipes');

module.exports.generatePlan = async () => {
    const recipes = await recipesController.getRecipes();
};