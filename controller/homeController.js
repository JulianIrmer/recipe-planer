const recipesController = require('./recipeController');
const recipeplanController = require('./planController');

module.exports.renderHome = async (req, res) => {
    const amount = 2;
    const recipes = await recipesController.get(null, amount);
    const recipeplan = await recipeplanController.getPlan();
    res.render('home', {recipes, recipeplan});
};




